import { query } from '../utils/db.js';

export async function getAllCustomers(filters = {}) {
    const { region, plan, risk, minUsage, maxUsage, search } = filters;
    let sql = `
        SELECT 
            c.id,
            c.name,
            c.email,
            c.region,
            c.plan,
            c.usage,
            c.last_active,
            c.contract_end_date,
            c.created_at,
            m.health_score,
            m.churn_risk,
            m.revenue,
            m.nps_score,
            m.previous_health_score,
            m.previous_churn_risk,
            (SELECT COUNT(*)::INTEGER FROM support_tickets WHERE customer_id = c.id AND status IN ('Open', 'In Progress')) as open_tickets,
            (SELECT COUNT(*)::INTEGER FROM support_tickets WHERE customer_id = c.id AND severity IN ('High', 'Critical') AND status != 'Closed') as high_severity_tickets
        FROM customers c
        LEFT JOIN metrics m ON c.id = m.customer_id
        WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (region) {
        sql += ` AND c.region = $${paramIndex}`;
        params.push(region);
        paramIndex++;
    }
    if (plan) {
        sql += ` AND c.plan = $${paramIndex}`;
        params.push(plan);
        paramIndex++;
    }
    if (risk) {
        sql += ` AND m.churn_risk = $${paramIndex}`;
        params.push(risk);
        paramIndex++;
    }
    if (minUsage) {
        sql += ` AND c.usage >= $${paramIndex}`;
        params.push(parseInt(minUsage));
        paramIndex++;
    }
    if (maxUsage) {
        sql += ` AND c.usage <= $${paramIndex}`;
        params.push(parseInt(maxUsage));
        paramIndex++;
    }
    if (search) {
        sql += ` AND (c.name ILIKE $${paramIndex} OR c.email ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
    }

    sql += ' ORDER BY c.id';
    
    const result = await query(sql, params);
    return result.rows;
}

export async function getDashboardData() {
    const result = await query(`
        SELECT 
            COUNT(DISTINCT c.id) as total_customers,
            COALESCE(AVG(m.health_score), 0)::INTEGER as avg_health_score,
            COALESCE(
                (COUNT(CASE WHEN m.churn_risk = 'High' THEN 1 END)::DECIMAL / 
                NULLIF(COUNT(DISTINCT c.id), 0)) * 100
            , 0)::DECIMAL(5,2) as churn_rate,
            COALESCE(SUM(m.revenue), 0)::DECIMAL(12,2) as total_revenue,
            COUNT(CASE WHEN m.churn_risk = 'High' THEN 1 END)::INTEGER as high_risk_count,
            COUNT(CASE WHEN m.churn_risk = 'Moderate' THEN 1 END)::INTEGER as moderate_risk_count,
            COUNT(CASE WHEN m.churn_risk = 'Healthy' THEN 1 END)::INTEGER as healthy_risk_count,
            COALESCE(AVG(m.nps_score), 0)::INTEGER as avg_nps
        FROM customers c
        LEFT JOIN metrics m ON c.id = m.customer_id
    `);
    return result.rows[0];
}

export async function getInsightsData() {
    const churnDistribution = await query(`
        SELECT 
            m.churn_risk,
            COUNT(*)::INTEGER as count
        FROM customers c
        LEFT JOIN metrics m ON c.id = m.customer_id
        GROUP BY m.churn_risk
    `);

    const revenueTrend = await query(`
        SELECT 
            DATE_TRUNC('month', ut.month) as month,
            SUM(ut.usage * (SELECT AVG(m.revenue) FROM metrics m WHERE m.customer_id = ut.customer_id)) as revenue
        FROM usage_trends ut
        GROUP BY DATE_TRUNC('month', ut.month)
        ORDER BY month
    `);

    const planDistribution = await query(`
        SELECT 
            c.plan,
            COUNT(*)::INTEGER as count,
            SUM(m.revenue)::DECIMAL(12,2) as revenue
        FROM customers c
        LEFT JOIN metrics m ON c.id = m.customer_id
        GROUP BY c.plan
    `);

    return { 
        churnDistribution: churnDistribution.rows, 
        revenueTrend: revenueTrend.rows,
        planDistribution: planDistribution.rows
    };
}

export async function getCustomerById(id) {
    const result = await query(`
        SELECT 
            c.id,
            c.name,
            c.email,
            c.region,
            c.plan,
            c.usage,
            c.last_active,
            c.contract_end_date,
            c.created_at,
            m.health_score,
            m.churn_risk,
            m.revenue,
            m.nps_score,
            m.previous_health_score,
            m.previous_churn_risk,
            (SELECT COUNT(*)::INTEGER FROM support_tickets WHERE customer_id = c.id AND status IN ('Open', 'In Progress')) as open_tickets,
            (SELECT COUNT(*)::INTEGER FROM support_tickets WHERE customer_id = c.id AND severity IN ('High', 'Critical') AND status != 'Closed') as high_severity_tickets
        FROM customers c
        LEFT JOIN metrics m ON c.id = m.customer_id
        WHERE c.id = $1
    `, [id]);
    return result.rows[0];
}

export async function getEventsByCustomerId(customerId) {
    const result = await query(`
        SELECT 
            id,
            type,
            description,
            created_at
        FROM events
        WHERE customer_id = $1
        ORDER BY created_at DESC
        LIMIT 50
    `, [customerId]);
    return result.rows;
}

export async function getUsageTrendsByCustomerId(id) {
    const result = await query(`
        SELECT month, usage
        FROM usage_trends
        WHERE customer_id = $1
        ORDER BY month DESC
        LIMIT 12
    `, [id]);
    return result.rows;
}

export async function getTicketsByCustomerId(id) {
    const result = await query(`
        SELECT 
            id,
            title,
            description,
            severity,
            status,
            created_at,
            resolved_at
        FROM support_tickets
        WHERE customer_id = $1
        ORDER BY created_at DESC
        LIMIT 20
    `, [id]);
    return result.rows;
}

export async function createCustomer(data) {
    const { name, email, region, plan, usage = 50, lastActive = new Date(), contractEndDate } = data;
    
    const client = await (await import('../utils/db.js')).getClient();
    try {
        await client.query('BEGIN');
        
        const result = await client.query(
            `INSERT INTO customers (name, email, region, plan, usage, last_active, contract_end_date) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
            [name, email, region, plan, usage, lastActive, contractEndDate]
        );
        const customerId = result.rows[0].id;

        const healthScore = usage;
        const churnRisk = usage < 30 ? 'High' : usage < 60 ? 'Moderate' : 'Healthy';
        const revenue = plan === 'Enterprise' ? 1000 : plan === 'Pro' ? 300 : 50;

        await client.query(
            `INSERT INTO metrics (customer_id, health_score, churn_risk, revenue, nps_score) 
             VALUES ($1, $2, $3, $4, $5)`,
            [customerId, healthScore, churnRisk, revenue, 50]
        );

        await client.query('COMMIT');
        return customerId;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

export async function updateCustomer(id, data) {
    const { name, email, region, plan, usage, lastActive, contractEndDate } = data;
    
    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (name !== undefined) {
        updates.push(`name = $${paramIndex}`);
        params.push(name);
        paramIndex++;
    }
    if (email !== undefined) {
        updates.push(`email = $${paramIndex}`);
        params.push(email);
        paramIndex++;
    }
    if (region !== undefined) {
        updates.push(`region = $${paramIndex}`);
        params.push(region);
        paramIndex++;
    }
    if (plan !== undefined) {
        updates.push(`plan = $${paramIndex}`);
        params.push(plan);
        paramIndex++;
    }
    if (usage !== undefined) {
        updates.push(`usage = $${paramIndex}`);
        params.push(usage);
        paramIndex++;
    }
    if (lastActive !== undefined) {
        updates.push(`last_active = $${paramIndex}`);
        params.push(lastActive);
        paramIndex++;
    }
    if (contractEndDate !== undefined) {
        updates.push(`contract_end_date = $${paramIndex}`);
        params.push(contractEndDate);
        paramIndex++;
    }

    if (updates.length === 0) return false;

    params.push(id);
    const result = await query(
        `UPDATE customers SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING id`,
        params
    );
    return result.rows[0]?.id;
}

export async function deleteCustomer(id) {
    await query(`DELETE FROM customers WHERE id = $1`, [id]);
    return true;
}

export async function getAlerts(limit = 10) {
    const result = await query(`
        SELECT 
            a.id,
            a.customer_id,
            c.name as customer_name,
            a.type,
            a.message,
            a.severity,
            a.is_read,
            a.created_at
        FROM alerts a
        LEFT JOIN customers c ON a.customer_id = c.id
        ORDER BY a.created_at DESC
        LIMIT $1
    `, [limit]);
    return result.rows;
}

export async function markAlertRead(alertId) {
    await query(`UPDATE alerts SET is_read = TRUE WHERE id = $1`, [alertId]);
    return true;
}

export async function getRecentAlerts() {
    const result = await query(`
        SELECT 
            a.id,
            a.customer_id,
            c.name as customer_name,
            a.type,
            a.message,
            a.severity,
            a.created_at
        FROM alerts a
        LEFT JOIN customers c ON a.customer_id = c.id
        WHERE a.created_at > NOW() - INTERVAL '24 hours'
        ORDER BY a.created_at DESC
        LIMIT 5
    `);
    return result.rows;
}

export async function getAllTickets(filters = {}) {
    const { severity, status, search } = filters;
    let sql = `
        SELECT 
            t.id,
            t.customer_id,
            c.name as customer_name,
            t.title,
            t.description,
            t.severity,
            t.status,
            t.created_at,
            t.resolved_at
        FROM support_tickets t
        LEFT JOIN customers c ON t.customer_id = c.id
        WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (severity) {
        sql += ` AND t.severity = $${paramIndex}`;
        params.push(severity);
        paramIndex++;
    }
    if (status) {
        sql += ` AND t.status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
    }
    if (search) {
        sql += ` AND (t.title ILIKE $${paramIndex} OR c.name ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
    }

    sql += ' ORDER BY t.created_at DESC';
    const result = await query(sql, params);
    return result.rows;
}

export async function getAllDevices(filters = {}) {
    const { status, search } = filters;
    let sql = `
        SELECT 
            d.id,
            d.customer_id,
            c.name as customer_name,
            d.device_name,
            d.serial_number,
            d.status,
            d.last_heartbeat
        FROM device_inventory d
        LEFT JOIN customers c ON d.customer_id = c.id
        WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;

    if (status) {
        sql += ` AND d.status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
    }
    if (search) {
        sql += ` AND (d.device_name ILIKE $${paramIndex} OR d.serial_number ILIKE $${paramIndex} OR c.name ILIKE $${paramIndex})`;
        params.push(`%${search}%`);
        paramIndex++;
    }

    sql += ' ORDER BY d.id';
    const result = await query(sql, params);
    return result.rows;
}

export async function getDevicesByCustomerId(customerId) {
    const result = await query(`
        SELECT id, device_name, serial_number, status, last_heartbeat
        FROM device_inventory
        WHERE customer_id = $1
        ORDER BY device_name
    `, [customerId]);
    return result.rows;
}