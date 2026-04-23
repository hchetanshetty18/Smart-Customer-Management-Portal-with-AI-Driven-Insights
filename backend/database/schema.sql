-- Drop existing tables
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS customer_health_history CASCADE;
DROP TABLE IF EXISTS usage_trends CASCADE;
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS metrics CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- Create customers table (base info)
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    region VARCHAR(100) NOT NULL,
    plan VARCHAR(50) NOT NULL,
    usage INTEGER NOT NULL CHECK (usage >= 0 AND usage <= 100),
    last_active TIMESTAMP NOT NULL,
    contract_end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create metrics table (current state)
CREATE TABLE metrics (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    health_score INTEGER NOT NULL CHECK (health_score >= 0 AND health_score <= 100),
    churn_risk VARCHAR(20) NOT NULL CHECK (churn_risk IN ('High', 'Moderate', 'Healthy')),
    revenue DECIMAL(10, 2) NOT NULL DEFAULT 0,
    nps_score INTEGER CHECK (nps_score >= 0 AND nps_score <= 100),
    previous_health_score INTEGER,
    previous_churn_risk VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create usage_trends table (monthly usage data)
CREATE TABLE usage_trends (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    month DATE NOT NULL,
    usage INTEGER NOT NULL CHECK (usage >= 0 AND usage <= 100),
    UNIQUE(customer_id, month)
);

-- Create support_tickets table
CREATE TABLE support_tickets (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity VARCHAR(20) CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    status VARCHAR(20) CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Create events table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create customer_health_history (for tracking changes)
CREATE TABLE customer_health_history (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    health_score INTEGER,
    churn_risk VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create alerts table (for live alerts)
CREATE TABLE alerts (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('info', 'warning', 'critical')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create device_inventory table
CREATE TABLE device_inventory (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    device_name VARCHAR(255) NOT NULL,
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Online', 'Offline', 'Maintenance')),
    last_heartbeat TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_customers_region ON customers(region);
CREATE INDEX idx_customers_plan ON customers(plan);
CREATE INDEX idx_metrics_customer_id ON metrics(customer_id);
CREATE INDEX idx_metrics_churn_risk ON metrics(churn_risk);
CREATE INDEX idx_events_customer_id ON events(customer_id);
CREATE INDEX idx_support_tickets_customer ON support_tickets(customer_id);
CREATE INDEX idx_usage_trends_customer ON usage_trends(customer_id);
CREATE INDEX idx_alerts_created ON alerts(created_at DESC);
CREATE INDEX idx_customer_health_history_customer ON customer_health_history(customer_id);
CREATE INDEX idx_device_inventory_customer ON device_inventory(customer_id);
CREATE INDEX idx_device_inventory_status ON device_inventory(status);