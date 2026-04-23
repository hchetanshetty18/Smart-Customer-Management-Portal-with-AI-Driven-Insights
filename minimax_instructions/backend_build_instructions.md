# SaaS Kastomer Backend Build Instructions

Please build a production-structured backend for a SaaS-style Customer Analytics Dashboard (no authentication for now).

## Tech Stack
- Node.js (latest LTS)
- Express.js
- PostgreSQL (raw `pg` driver)
- Clean architecture (routes, controllers, services, models)
- ES modules (`"type": "module"`)

## 1. Project Structure
Create the following structure inside a `backend/` directory:
```
backend/
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── database/
│   ├── schema.sql
│   └── seed.js
├── package.json
└── .env
```

## 2. Database Schema (PostgreSQL)

**Tables to create:**
- `customers` (id, name, region, plan, usage (percentage), last_active (timestamp))
- `metrics` (id, customer_id (FK), health_score, churn_risk, revenue)
- `events` (id, customer_id (FK), type, description, created_at)

Also include:
- SQL schema creation scripts (`database/schema.sql`).
- Seed script (`database/seed.js`) with 20–30 realistic dummy records.

## 3. Business Logic (IMPORTANT)

Implement the following business logic, primarily handled in the `services/` layer or calculated during seeding:

**Churn Risk Logic:**
- If `usage` < 30% AND `last_active` > 7 days → "High Risk"
- If `usage` between 30–60% → "Moderate"
- Else → "Healthy"

**Health Score:**
- Number from 0-100 based on usage percentage and recency of activity (e.g., usage minus penalties for inactivity).

## 4. Backend Features & Endpoints

Implement the following REST APIs under the `/api` prefix:

**GET `/api/dashboard`**
- Return total customers, average health score, churn rate.

**GET `/api/customers`**
- Return all customers.
- Support filtering by region, plan, and risk (e.g., `?region=Europe&plan=Pro&risk=High`).

**GET `/api/insights`**
- Return revenue trend (mock monthly data).
- Return churn distribution (healthy, moderate, high risk counts).

**POST `/api/ask-ai`**
- Accept a natural language query in the request body (e.g., `{"query": "high risk customers"}`).
- Parse simple queries using lightweight keyword matching (e.g., "high risk", "low usage", "healthy", "enterprise").
- Return a structured JSON response containing a summary string and the matched data list.

## 5. Coding Requirements
- Use `async/await` everywhere.
- Implement proper, centralized error handling (`utils/errorHandler.js`).
- Write clean, readable code with no unnecessary complexity.
- Add comments only where needed.
- Skip authentication/login completely.

## 6. Output Expectation
- Provide step-by-step setup instructions to initialize the db, install dependencies, and run the app.
- Output the full code for all files listed in the structure.
- Provide SQL scripts separately.
- Document example API responses for each endpoint.
