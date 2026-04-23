import { query } from '../utils/db.js';
import { predictChurnWithExplanation, getRecommendedActions } from './healthService.js';

export async function generateEmailSummary(customerId) {
  const customer = await query(`
    SELECT 
      c.id,
      c.name,
      c.email,
      c.region,
      c.plan,
      c.usage,
      c.last_active,
      c.contract_end_date,
      m.health_score,
      m.churn_risk,
      m.revenue,
      m.nps_score,
      (SELECT COUNT(*)::INTEGER FROM support_tickets WHERE customer_id = c.id AND status IN ('Open', 'In Progress')) as open_tickets,
      (SELECT COUNT(*)::INTEGER FROM support_tickets WHERE customer_id = c.id WHERE severity IN ('High', 'Critical') AND status != 'Closed') as high_severity_tickets
    FROM customers c
    LEFT JOIN metrics m ON c.id = m.customer_id
    WHERE c.id = $1
  `, [customerId]);

  if (!customer.rows[0]) {
    throw new Error('Customer not found');
  }

  const c = customer.rows[0];
  const prediction = await predictChurnWithExplanation(customerId);
  const actions = await getRecommendedActions(customerId);

  const daysUntilRenewal = c.contract_end_date 
    ? Math.ceil((new Date(c.contract_end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const issues = [];
  if (c.health_score < 50) issues.push(`Low health score: ${c.health_score}/100`);
  if (c.churn_risk === 'High') issues.push('High churn risk detected');
  if (c.open_tickets > 0) issues.push(`${c.open_tickets} unresolved support ticket(s)`);
  if (c.nps_score < 50) issues.push(`Low NPS score: ${c.nps_score}/100`);
  if (daysUntilRenewal && daysUntilRenewal < 60) issues.push(`Contract expires in ${daysUntilRenewal} days`);

  const subject = `Weekly Customer Health Report – ${c.name}`;
  
  const body = `
Dear Customer Success Team,

This is the weekly health report for ${c.name} (${c.region}).

---
ACCOUNT OVERVIEW
---
Name: ${c.name}
Email: ${c.email || 'N/A'}
Plan: ${c.plan}
Region: ${c.region}
Monthly Revenue: $${c.revenue || 0}

---
HEALTH METRICS
---
Health Score: ${c.health_score || 0}/100
Churn Risk: ${c.churn_risk || 'Unknown'}
NPS Score: ${c.nps_score || 'N/A'} (Industry avg: 45)
Current Usage: ${c.usage || 0}%
Open Tickets: ${c.open_tickets || 0}

---
KEY ISSUES
---
${issues.length > 0 ? issues.map(i => `• ${i}`).join('\n') : '• No critical issues detected'}

---
CHURN ANALYSIS
---
${prediction?.reasons?.length > 0 ? prediction.reasons.map(r => `• ${r}`).join('\n') : '• No significant risk factors'}

Churn Probability: ${prediction?.churn_probability || 0}%

---
RECOMMENDED ACTIONS
---
${actions.map((a, i) => `${i + 1}. ${a.action} (${a.priority} priority)\n   Why: ${a.reason}`).join('\n')}

---
Generated: ${new Date().toISOString()}
  `.trim();

  return {
    customer_id: c.id,
    customer_name: c.name,
    subject,
    body
  };
}