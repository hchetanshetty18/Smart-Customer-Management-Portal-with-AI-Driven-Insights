import pg from 'pg';
import dotenv from 'dotenv';
import { predictChurnWithExplanation } from '../src/services/healthService.js';

dotenv.config({ path: './backend/.env' });

const pool = new pg.Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'saas_kastomer',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres123'
});

async function evaluateChurn() {
    console.log('--- Churn Prediction Evaluation ---');
    
    try {
        // Fetch customers with their trajectories (which we seeded)
        // We'll treat 'declining' as the "True Churn" (Positive class)
        const result = await pool.query(`
            SELECT c.id, c.name, e.description as trajectory
            FROM customers c
            JOIN events e ON c.id = e.customer_id
            WHERE e.type = 'System' AND e.description IN ('Trajectory: declining', 'Trajectory: stable', 'Trajectory: improving')
        `);

        const customers = result.rows;
        console.log(`Evaluating ${customers.length} customers...`);

        let tp = 0; // True Positive
        let fp = 0; // False Positive
        let tn = 0; // True Negative
        let fn = 0; // False Negative

        for (const customer of customers) {
            const prediction = await predictChurnWithExplanation(customer.id);
            const isPredictedChurn = prediction.risk === 'High';
            const isTrueChurn = customer.trajectory === 'Trajectory: declining';

            if (isPredictedChurn && isTrueChurn) tp++;
            else if (isPredictedChurn && !isTrueChurn) fp++;
            else if (!isPredictedChurn && !isTrueChurn) tn++;
            else if (!isPredictedChurn && isTrueChurn) fn++;
        }

        const precision = tp / (tp + fp) || 0;
        const recall = tp / (tp + fn) || 0;
        const f1 = (2 * precision * recall) / (precision + recall) || 0;
        const accuracy = (tp + tn) / (tp + fp + tn + fn);

        console.log('\nResults:');
        console.log(`- Total Sample: ${customers.length}`);
        console.log(`- Accuracy:  ${(accuracy * 100).toFixed(2)}%`);
        console.log(`- Precision: ${(precision * 100).toFixed(2)}%`);
        console.log(`- Recall:    ${(recall * 100).toFixed(2)}%`);
        console.log(`- F1 Score:  ${f1.toFixed(4)}`);
        console.log('\nConfusion Matrix:');
        console.log(`       | Predicted: Churn | Predicted: Not Churn`);
        console.log(`Actual: Churn     | TP: ${tp} | FN: ${fn}`);
        console.log(`Actual: Not Churn | FP: ${fp} | TN: ${tn}`);

    } catch (err) {
        console.error('Evaluation failed:', err);
    } finally {
        await pool.end();
    }
}

evaluateChurn();
