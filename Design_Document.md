# Design Document: Smart Customer Management Portal

## 1. Project Overview
The Smart Customer Management Portal is a comprehensive SaaS solution designed to monitor customer health, predict churn using AI-driven insights, and manage hardware inventory and support tickets. It provides a data-rich dashboard for customer success teams to proactively engage with at-risk accounts.

## 2. System Architecture
The application follows a modern full-stack architecture:
- **Frontend**: React 19 with Vite, Tailwind CSS for styling, and Lucide-React for iconography.
- **Backend**: Node.js with Express, providing a RESTful API.
- **Database**: PostgreSQL for persistent storage of customer, metric, and device data.
- **AI Engine**: A heuristic-based NLP engine (simulating an LLM) that translates natural language queries into database filters and provides automated churn reasoning.

## 3. Data Model
The database schema consists of several interconnected tables:
- `customers`: Core customer profiles (name, region, plan, etc.).
- `metrics`: Real-time health scores, churn risk categories, and revenue data.
- `support_tickets`: CRUD-enabled support issues linked to customers.
- `device_inventory`: Hardware inventory tracking (serial numbers, status, heartbeats).
- `usage_trends`: Historical usage data for trend analysis.
- `events`: System-generated logs of customer activities.

## 4. AI & Churn Prediction Logic
### Churn Prediction
Churn risk is calculated using a weighted health score formula:
- **Usage (40%)**: Normalized average usage over the last 30 days.
- **NPS (20%)**: Latest Net Promoter Score.
- **Support Burden (20%)**: Inverse of open ticket count and severity.
- **Contract Longevity (10%)**: Time until contract expiration.
- **Activity (10%)**: Days since last login.

A score below 40 triggers a "High Risk" alert, while 40-70 is "Moderate".

### AI Assistant (AskAI)
The AI assistant uses a multi-stage NLP pipeline:
1. **Intent Recognition**: Maps user input to `filter_customers`, `summary_insights`, or `reasons_analysis`.
2. **Entity Extraction**: Identifies regions, plans, and risk levels from the query.
3. **Reasoning Layer**: A simulated LLM "thought process" that explains the logic behind the results (e.g., "Identified 5 high-risk customers in Europe due to low activity").

## 5. Scaling Considerations
- **Database Indexing**: Critical indexes on `customer_id` and `churn_risk` ensure fast dashboard loading even with 10,000+ records.
- **Background Workers**: Churn prediction can be moved to a periodic background job for massive datasets.
- **Caching**: API responses for dashboard metrics can be cached using Redis to reduce DB load.

## 6. Deliverables
- **Codebase**: Full source code for frontend and backend.
- **Precision/Recall Report**: Generated via `backend/scripts/evaluate_churn.js`.
- **Live Demo**: Functional web portal with CRUD and AI capabilities.
