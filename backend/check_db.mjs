import pg from 'pg';
const { Pool } = pg;
const pool = new Pool({ host: 'localhost', port: 5432, database: 'saas_kastomer', user: 'postgres', password: 'postgres123' });
const r = await pool.query(`SELECT DATE_TRUNC('month', c.created_at) as month, SUM(m.revenue) as revenue FROM customers c LEFT JOIN metrics m ON c.id = m.customer_id GROUP BY DATE_TRUNC('month', c.created_at) ORDER BY month`);
console.log(JSON.stringify(r.rows, null, 2));
await pool.end();
