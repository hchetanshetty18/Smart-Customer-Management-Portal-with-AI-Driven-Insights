import { query } from '../utils/db.js';

const WEIGHTS = {
    usage: 0.40,
    nps: 0.20,
    tickets: 0.20,
    contract: 0.10,
    inactivity: 0.10
};

export async function calculateHealthScore(customerId) {
    const customer = await query(`
        SELECT 
            c.usage,
            c.last_active,
            c.contract_end_date,
            m.nps_score,
            (SELECT COUNT(*)::INTEGER FROM support_tickets WHERE customer_id = c.id AND status IN ('Open', 'In Progress')) as open_tickets,
            (SELECT COUNT(*)::INTEGER FROM support_tickets WHERE customer_id = c.id AND severity IN ('High', 'Critical') AND status != 'Closed') as high_severity_tickets
        FROM customers c
        LEFT JOIN metrics m ON c.id = m.customer_id
        WHERE c.id = $1
    `, [customerId]);

    if (!customer.rows[0]) return null;
    const c = customer.rows[0];

    const usageScore = c.usage * WEIGHTS.usage;
    const npsScore = (c.nps_score || 50) * WEIGHTS.nps;
    
    let ticketPenalty = 0;
    if (c.open_tickets > 0) ticketPenalty += Math.min(15, c.open_tickets * 5);
    if (c.high_severity_tickets > 0) ticketPenalty += c.high_severity_tickets * 3;
    ticketPenalty = Math.min(20, ticketPenalty);
    const ticketScore = (20 - ticketPenalty) * (WEIGHTS.tickets / 20) * 100;

    const daysUntilRenewal = c.contract_end_date 
        ? Math.ceil((new Date(c.contract_end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 365;
    let contractScore = 10;
    if (daysUntilRenewal < 30) contractScore = 0;
    else if (daysUntilRenewal < 60) contractScore = 3;
    else if (daysUntilRenewal < 90) contractScore = 6;
    contractScore = contractScore * (WEIGHTS.contract / 10) * 100;

    const lastActiveDays = c.last_active 
        ? Math.ceil((Date.now() - new Date(c.last_active).getTime()) / (1000 * 60 * 60 * 24))
        : 0;
    let inactivityScore = 10;
    if (lastActiveDays > 21) inactivityScore = 0;
    else if (lastActiveDays > 14) inactivityScore = 3;
    else if (lastActiveDays > 7) inactivityScore = 6;
    inactivityScore = inactivityScore * (WEIGHTS.inactivity / 10) * 100;

    const healthScore = Math.max(0, Math.min(100, Math.round(
        usageScore + npsScore + ticketScore + contractScore + inactivityScore
    )));

    return healthScore;
}

export async function predictChurnWithExplanation(customerId) {
    const customer = await query(`
        SELECT 
            c.id,
            c.name,
            c.usage,
            c.last_active,
            c.contract_end_date,
            m.health_score,
            m.churn_risk,
            m.nps_score,
            m.previous_health_score,
            (SELECT COUNT(*)::INTEGER FROM support_tickets WHERE customer_id = c.id AND status IN ('Open', 'In Progress')) as open_tickets,
            (SELECT COUNT(*)::INTEGER FROM support_tickets WHERE customer_id = c.id AND severity IN ('High', 'Critical') AND status != 'Closed') as high_severity_tickets,
            (SELECT usage FROM usage_trends WHERE customer_id = c.id ORDER BY month DESC LIMIT 1) as last_month_usage,
            (SELECT usage FROM usage_trends WHERE customer_id = c.id ORDER BY month DESC OFFSET 1 LIMIT 1) as two_months_ago_usage
        FROM customers c
        LEFT JOIN metrics m ON c.id = m.customer_id
        WHERE c.id = $1
    `, [customerId]);

    if (!customer.rows[0]) return null;
    const c = customer.rows[0];
    const reasons = [];
    let riskScore = 0;

    const lastActiveDays = c.last_active 
        ? Math.ceil((Date.now() - new Date(c.last_active).getTime()) / (1000 * 60 * 60 * 24))
        : 999;
    if (lastActiveDays > 14) {
        reasons.push(`No activity for ${lastActiveDays} days`);
        riskScore += 25;
    } else if (lastActiveDays > 7) {
        reasons.push(`Low activity (${lastActiveDays} days since last login)`);
        riskScore += 10;
    }

    const usageChange = c.last_month_usage && c.two_months_ago_usage 
        ? ((c.last_month_usage - c.two_months_ago_usage) / c.two_months_ago_usage * 100)
        : 0;
    if (usageChange < -20) {
        reasons.push(`Usage dropped ${Math.abs(Math.round(usageChange))}% in last month`);
        riskScore += 20;
    } else if (usageChange < -10) {
        reasons.push(`Usage declining over time`);
        riskScore += 10;
    }

    if (c.open_tickets > 2) {
        reasons.push(`${c.open_tickets} unresolved support tickets`);
        riskScore += 15;
    }
    if (c.high_severity_tickets > 0) {
        reasons.push(`${c.high_severity_tickets} high/critical severity tickets`);
        riskScore += 15;
    }

    if (c.nps_score < 30) {
        reasons.push(`Very low NPS score: ${c.nps_score}/100`);
        riskScore += 15;
    } else if (c.nps_score < 50) {
        reasons.push(`Low NPS score: ${c.nps_score}/100`);
        riskScore += 8;
    }

    if (c.contract_end_date) {
        const daysUntilRenewal = Math.ceil((new Date(c.contract_end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (daysUntilRenewal < 30 && daysUntilRenewal > 0) {
            reasons.push(`Contract expires in ${daysUntilRenewal} days`);
            riskScore += 15;
        }
    }

    if (c.previous_health_score && c.health_score) {
        const healthDecline = c.previous_health_score - c.health_score;
        if (healthDecline > 15) {
            reasons.push(`Health score dropped ${healthDecline} points`);
            riskScore += 10;
        }
    }

    const churnProbability = Math.min(95, Math.max(5, riskScore));
    let riskLevel = 'Low';
    if (churnProbability >= 60) riskLevel = 'High';
    else if (churnProbability >= 35) riskLevel = 'Moderate';

    return {
        customer_id: c.id,
        customer_name: c.name,
        risk_level: riskLevel,
        churn_probability: churnProbability,
        reasons: reasons.length > 0 ? reasons : ['No significant risk factors detected'],
        health_score: c.health_score,
        nps_score: c.nps_score,
        open_tickets: c.open_tickets,
        last_active_days: lastActiveDays
    };
}

export async function getRecommendedActions(customerId) {
    const prediction = await predictChurnWithExplanation(customerId);
    if (!prediction) return [];

    const actions = [];

    if (prediction.risk_level === 'High') {
        actions.push({
            action: 'Schedule immediate check-in call',
            priority: 'high',
            reason: 'Customer shows high churn risk indicators'
        });
        actions.push({
            action: 'Review and resolve all open support tickets',
            priority: 'high',
            reason: 'Unresolved tickets increase churn probability'
        });
    }

    if (prediction.reasons.some(r => r.includes('Usage'))) {
        actions.push({
            action: 'Provide onboarding or product training',
            priority: 'medium',
            reason: 'Usage patterns indicate potential product confusion'
        });
    }

    if (prediction.reasons.some(r => r.includes('NPS'))) {
        actions.push({
            action: 'Send satisfaction survey',
            priority: 'medium',
            reason: 'Low NPS indicates experience issues'
        });
    }

    if (prediction.reasons.some(r => r.includes('Contract'))) {
        actions.push({
            action: 'Initiate renewal discussion',
            priority: 'high',
            reason: 'Contract renewal approaching'
        });
    }

    if (prediction.reasons.some(r => r.includes('ticket'))) {
        actions.push({
            action: 'Escalate support priority',
            priority: 'medium',
            reason: 'Multiple open tickets indicate frustration'
        });
    }

    if (actions.length === 0) {
        actions.push({
            action: 'Continue regular engagement',
            priority: 'low',
            reason: 'No specific concerns identified'
        });
    }

    return actions;
}

export async function getCustomerInsight(customerId) {
    const prediction = await predictChurnWithExplanation(customerId);
    const actions = await getRecommendedActions(customerId);
    const customer = await query(`
        SELECT m.revenue FROM metrics m WHERE m.customer_id = $1
    `, [customerId]);
    
    const revenue = customer.rows[0]?.revenue || 0;

    let impact = null;
    if (prediction && prediction.risk_level !== 'Low') {
        impact = {
            potential_revenue_loss: revenue,
            risk_factors: prediction.reasons.length
        };
    }

    return {
        title: prediction?.risk_level === 'High' ? 'Customer at Risk' : 
              prediction?.risk_level === 'Moderate' ? 'Moderate Risk Detected' : 'Customer Healthy',
        risk_level: prediction?.risk_level || 'Healthy',
        churn_probability: prediction?.churn_probability || 5,
        reasons: prediction?.reasons || [],
        impact,
        recommended_actions: actions,
        generated_at: new Date().toISOString()
    };
}

export async function getWeightedHealthBreakdown(customerId) {
    const customer = await query(`
        SELECT 
            c.usage,
            c.last_active,
            c.contract_end_date,
            m.nps_score,
            (SELECT COUNT(*)::INTEGER FROM support_tickets WHERE customer_id = c.id AND status IN ('Open', 'In Progress')) as open_tickets,
            (SELECT COUNT(*)::INTEGER FROM support_tickets WHERE customer_id = c.id AND severity IN ('High', 'Critical') AND status != 'Closed') as high_severity_tickets
        FROM customers c
        LEFT JOIN metrics m ON c.id = m.customer_id
        WHERE c.id = $1
    `, [customerId]);

    if (!customer.rows[0]) return null;
    const c = customer.rows[0];

    const lastActiveDays = c.last_active 
        ? Math.ceil((Date.now() - new Date(c.last_active).getTime()) / (1000 * 60 * 60 * 24))
        : 999;

    const breakdown = {
        usage: {
            score: c.usage,
            weight: WEIGHTS.usage,
            contribution: c.usage * WEIGHTS.usage,
            status: c.usage >= 70 ? 'good' : c.usage >= 40 ? 'fair' : 'poor'
        },
        nps: {
            score: c.nps_score || 50,
            weight: WEIGHTS.nps,
            contribution: (c.nps_score || 50) * WEIGHTS.nps,
            status: (c.nps_score || 50) >= 70 ? 'good' : (c.nps_score || 50) >= 40 ? 'fair' : 'poor'
        },
        tickets: {
            score: c.high_severity_tickets,
            weight: WEIGHTS.tickets,
            penalty: Math.min(20, (c.open_tickets || 0) * 5 + (c.high_severity_tickets || 0) * 3),
            contribution: Math.max(0, 20 - Math.min(20, (c.open_tickets || 0) * 5 + (c.high_severity_tickets || 0) * 3)) * (WEIGHTS.tickets / 20) * 100,
            status: (c.open_tickets || 0) === 0 ? 'good' : (c.open_tickets || 0) <= 2 ? 'fair' : 'poor'
        },
        contract: {
            score: c.contract_end_date ? Math.ceil((new Date(c.contract_end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 365,
            weight: WEIGHTS.contract,
            contribution: 10,
            status: 'good'
        },
        inactivity: {
            score: lastActiveDays,
            weight: WEIGHTS.inactivity,
            penalty: lastActiveDays > 21 ? 10 : lastActiveDays > 14 ? 6 : lastActiveDays > 7 ? 3 : 0,
            contribution: Math.max(0, 10 - (lastActiveDays > 21 ? 10 : lastActiveDays > 14 ? 6 : lastActiveDays > 7 ? 3 : 0)) * (WEIGHTS.inactivity / 10) * 100,
            status: lastActiveDays <= 7 ? 'good' : lastActiveDays <= 14 ? 'fair' : 'poor'
        }
    };

    const totalHealthScore = Object.values(breakdown).reduce((sum, metric) => sum + metric.contribution, 0);

    return {
        breakdown,
        calculated_health_score: Math.round(totalHealthScore),
        calculated_at: new Date().toISOString()
    };
}