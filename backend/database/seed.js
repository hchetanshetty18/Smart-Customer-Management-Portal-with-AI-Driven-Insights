import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'saas_kastomer',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
});

const REGIONS = ['North America', 'Europe', 'Asia Pacific', 'Latin America'];
const PLANS = ['Starter', 'Pro', 'Enterprise'];
const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];
const TICKET_STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];

const CUSTOMER_TEMPLATES = [
    'Acme', 'Tech', 'Global', 'Nordic', 'Pacific', 'Atlas', 'Horizon', 'Summit',
    'Coastal', 'Metro', 'Peak', 'Delta', 'Aurora', 'Titan', 'Phoenix', 'Cascade',
    'Vanguard', 'Nexus', 'Omega', 'Zenith', 'Pioneer', 'Sterling', 'Quantum', 'Frontier',
    'Apex', 'Fusion', 'Vertex', 'Cipher', 'Dynamo', 'Echo', 'Flux', 'Helix',
    'Ignite', 'Jolt', 'Keystone', 'Latitude', 'Momentum', 'Nova', 'Orbit', 'Prism',
    'Quasar', 'Radius', 'Synapse', 'Trove', 'Unity', 'Vector', 'Wave', 'Xenon',
    'Yield', 'Zero', 'Amplit', 'Blaze', 'Core', 'Dawn', 'Edge', 'Focal', 'Glide',
    'Haven', 'Index', 'Jade', 'Kite', 'Lunar', 'Mode', 'Node', 'Onix', 'Pulse',
    'Quest', 'Rise', 'Spark', 'Trend', 'Ulta', 'Volt', 'Wrap', 'Xerox', 'Yarn',
    'Zone', 'Alpha', 'Beam', 'Cycle', 'Drive', 'Ember', 'Focus', 'Glow', 'Heat',
    'Ion', 'Jet', 'Kin', 'Layer', 'Mist', 'Nest', 'Open', 'Peak', 'Roar',
    'Saga', 'Tune', 'Urge', 'View', 'Weave', 'Zest', 'Aim', 'Bolt', 'Crisp'
];

const INDUSTRIES = ['SaaS', 'E-commerce', 'FinTech', 'Healthcare', 'Education', 'Retail', 'Media', 'Logistics'];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function determineCustomerTrajectory() {
    const rand = Math.random();
    if (rand < 0.15) return 'declining';
    if (rand < 0.30) return 'improving';
    return 'stable';
}

function generateUsageTrend(trajectory, currentUsage) {
    const trends = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        let usage;
        
        if (trajectory === 'declining') {
            usage = Math.max(5,Math.min(95, currentUsage - (6 - i) * getRandomInt(5, 12) + getRandomInt(-5, 5)));
        } else if (trajectory === 'improving') {
            usage = Math.max(5,Math.min(95, currentUsage - (5 - i) * getRandomInt(3, 8) + getRandomInt(-5, 8)));
        } else {
            usage = Math.max(20, Math.min(95, currentUsage + getRandomInt(-10, 10)));
        }
        trends.push({ month, usage: Math.min(95, Math.max(5, usage)) });
    }
    return trends;
}

async function seedDatabase() {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        await client.query('DELETE FROM alerts');
        await client.query('DELETE FROM customer_health_history');
        await client.query('DELETE FROM usage_trends');
        await client.query('DELETE FROM support_tickets');
        await client.query('DELETE FROM events');
        await client.query('DELETE FROM metrics');
        await client.query('DELETE FROM customers');

        await client.query(`
            SELECT setval('customers_id_seq', 1, false);
            SELECT setval('metrics_id_seq', 1, false);
            SELECT setval('events_id_seq', 1, false);
            SELECT setval('support_tickets_id_seq', 1, false);
            SELECT setval('usage_trends_id_seq', 1, false);
            SELECT setval('alerts_id_seq', 1, false);
        `);

        const TOTAL_CUSTOMERS = 210;
        const customers = [];

        for (let i = 0; i < TOTAL_CUSTOMERS; i++) {
            const template = getRandomElement(CUSTOMER_TEMPLATES);
            const suffix = getRandomElement(['Corp', 'Inc', 'LLC', 'Ltd', 'Solutions', 'Systems', 'Group', 'Ventures']);
            const name = `${template} ${suffix}`;
            const email = `${template.toLowerCase()}@${suffix.toLowerCase()}.com`;
            const region = getRandomElement(REGIONS);
            const plan = getRandomElement(PLANS);
            const trajectory = determineCustomerTrajectory();
            
            let baseUsage;
            if (trajectory === 'declining') {
                baseUsage = getRandomInt(15, 50);
            } else if (trajectory === 'improving') {
                baseUsage = getRandomInt(40, 75);
            } else {
                baseUsage = getRandomInt(30, 90);
            }
            
            const lastActiveDays = getRandomInt(1, 40);
            const lastActive = new Date(Date.now() - lastActiveDays * 24 * 60 * 60 * 1000);
            
            const createdDaysAgo = getRandomInt(30, 500);
            const createdAt = new Date(Date.now() - createdDaysAgo * 24 * 60 * 60 * 1000);
            
            const contractEndDate = getRandomDate(
                new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            );
            
            const npsScore = getRandomInt(0, 100);
            
            const result = await client.query(
                `INSERT INTO customers (name, email, region, plan, usage, last_active, contract_end_date, created_at) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
                [name, email, region, plan, baseUsage, lastActive, contractEndDate, createdAt]
            );
            const customerId = result.rows[0].id;

            const usageTrends = generateUsageTrend(trajectory, baseUsage);
            for (const trend of usageTrends) {
                await client.query(
                    `INSERT INTO usage_trends (customer_id, month, usage) VALUES ($1, $2, $3)
                     ON CONFLICT (customer_id, month) DO UPDATE SET usage = $3`,
                    [customerId, trend.month, trend.usage]
                );
            }

            const numTickets = getRandomInt(0, 8);
            for (let t = 0; t < numTickets; t++) {
                const ticketSeverity = getRandomElement(SEVERITIES);
                const status = getRandomElement(TICKET_STATUSES);
                const createdDays = getRandomInt(1, createdDaysAgo);
                const createdAtTicket = new Date(Date.now() - createdDays * 24 * 60 * 60 * 1000);
                const resolvedAt = status === 'Resolved' || status === 'Closed' 
                    ? new Date(createdAtTicket.getTime() + getRandomInt(1, 10) * 24 * 60 * 60 * 1000)
                    : null;
                
                await client.query(
                    `INSERT INTO support_tickets (customer_id, title, description, severity, status, created_at, resolved_at)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [customerId, `Issue #${getRandomInt(1000, 9999)}`, `Customer reported ${getRandomElement(['issue', 'bug', 'question', 'request'])}`, ticketSeverity, status, createdAtTicket, resolvedAt]
                );
            }

            let churnRisk, healthScore, previousHealthScore, previousChurnRisk;
            
            if (trajectory === 'declining') {
                churnRisk = baseUsage < 25 || lastActiveDays > 14 ? 'High' : 'Moderate';
                previousChurnRisk = 'Moderate';
                previousHealthScore = Math.min(100, baseUsage + getRandomInt(10, 20));
            } else if (trajectory === 'improving') {
                churnRisk = baseUsage > 60 && lastActiveDays < 7 ? 'Healthy' : 'Moderate';
                previousChurnRisk = 'Moderate';
                previousHealthScore = Math.max(0, baseUsage - getRandomInt(10, 20));
            } else {
                churnRisk = baseUsage > 70 && lastActiveDays < 5 ? 'Healthy' : 'Moderate';
                previousChurnRisk = churnRisk;
                previousHealthScore = baseUsage;
            }

            const openTickets = await client.query(
                `SELECT COUNT(*) FROM support_tickets WHERE customer_id = $1 AND status IN ('Open', 'In Progress')`,
                [customerId]
            );
            const openTicketCount = parseInt(openTickets.rows[0].count) || 0;
            const highSeverityTickets = await client.query(
                `SELECT COUNT(*) FROM support_tickets WHERE customer_id = $1 AND severity IN ('High', 'Critical') AND status != 'Closed'`,
                [customerId]
            );
            const highSevCount = parseInt(highSeverityTickets.rows[0].count) || 0;

            const usageWeight = baseUsage * 0.4;
            const npsWeight = npsScore * 0.2;
            let ticketPenalty = 0;
            if (openTicketCount > 0) ticketPenalty += Math.min(15, openTicketCount * 5);
            if (highSevCount > 0) ticketPenalty += highSevCount * 5;
            ticketPenalty = Math.min(20, ticketPenalty);
            
            const daysUntilRenewal = Math.ceil((new Date(contractEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            let contractRisk = 0;
            if (daysUntilRenewal < 30) contractRisk = 15;
            else if (daysUntilRenewal < 60) contractRisk = 10;
            else if (daysUntilRenewal < 90) contractRisk = 5;
            
            let inactivityPenalty = 0;
            if (lastActiveDays > 14) inactivityPenalty = 10;
            else if (lastActiveDays > 7) inactivityPenalty = 5;
            
            healthScore = Math.max(0, Math.min(100, Math.round(
                usageWeight + npsWeight + (20 - ticketPenalty) + (10 - contractRisk) + (10 - inactivityPenalty)
            )));

            const revenue = plan === 'Enterprise' ? getRandomInt(500, 2500) : 
                          plan === 'Pro' ? getRandomInt(150, 600) : 
                          getRandomInt(25, 150);

            await client.query(
                `INSERT INTO metrics (customer_id, health_score, churn_risk, revenue, nps_score, previous_health_score, previous_churn_risk) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [customerId, healthScore, churnRisk, revenue, npsScore, previousHealthScore, previousChurnRisk]
            );

            if (churnRisk === 'High' && previousChurnRisk !== 'High') {
                await client.query(
                    `INSERT INTO alerts (customer_id, type, message, severity) VALUES ($1, $2, $3, $4)`,
                    [customerId, 'risk_increase', `Customer ${name} moved to High risk`, 'warning']
                );
            }

            if (previousHealthScore && Math.abs(healthScore - previousHealthScore) > 15) {
                await client.query(
                    `INSERT INTO customer_health_history (customer_id, health_score, churn_risk) VALUES ($1, $2, $3)`,
                    [customerId, previousHealthScore, previousChurnRisk]
                );
            }

            const eventTypes = ['subscription', 'upgrade', 'payment', 'login', 'feature_usage'];
            const numEvents = getRandomInt(0, 4);
            for (let e = 0; e < numEvents; e++) {
                const eventType = getRandomElement(eventTypes);
                const eventDays = getRandomInt(1, Math.min(30, createdDaysAgo));
                const eventCreated = new Date(Date.now() - eventDays * 24 * 60 * 60 * 1000);
                await client.query(
                    `INSERT INTO events (customer_id, type, description, created_at) VALUES ($1, $2, $3, $4)`,
                    [customerId, eventType, `${eventType} event`, eventCreated]
                );
            }

            customers.push({
                id: customerId,
                name,
                region,
                plan,
                usage: baseUsage,
                healthScore,
                churnRisk,
                trajectory,
                npsScore,
                openTicketCount
            });

            // Generate Device Inventory
            const numDevices = getRandomInt(3, 12);
            const deviceModels = ['EdgeRouter Pro', 'Switch 24 PoE', 'Access Point 6', 'Security Gateway', 'NanoStation', 'PowerBeam'];
            for (let d = 0; d < numDevices; d++) {
                const model = getRandomElement(deviceModels);
                const status = Math.random() < 0.9 ? 'Online' : Math.random() < 0.7 ? 'Offline' : 'Maintenance';
                const serial = `SN-${customerId}-${d}-${getRandomInt(1000, 9999)}`;
                const heartbeat = new Date(Date.now() - getRandomInt(0, 120) * 60 * 1000); // within last 2 hours
                
                await client.query(
                    `INSERT INTO device_inventory (customer_id, device_name, serial_number, status, last_heartbeat)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [customerId, model, serial, status, status === 'Online' ? heartbeat : new Date(Date.now() - getRandomInt(120, 10000) * 60 * 1000)]
                );
            }
        }

        await client.query('COMMIT');
        console.log(`✅ Seeded ${customers.length} customers successfully`);
        
        const riskCounts = { High: 0, Moderate: 0, Healthy: 0 };
        customers.forEach(c => riskCounts[c.churnRisk]++);
        console.log('📊 Churn risk distribution:', riskCounts);
        
        const trajectoryCounts = { declining: 0, improving: 0, stable: 0 };
        customers.forEach(c => trajectoryCounts[c.trajectory]++);
        console.log('📈 Usage trajectories:', trajectoryCounts);

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Error seeding database:', err);
        throw err;
    } finally {
        client.release();
        await pool.end();
    }
}

seedDatabase()
    .then(() => {
        console.log('🎉 Database seeding complete');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Database seeding failed:', err);
        process.exit(1);
    });