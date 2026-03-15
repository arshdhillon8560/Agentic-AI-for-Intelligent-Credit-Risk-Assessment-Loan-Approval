CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(150),
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(20) DEFAULT 'applicant',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    application_id VARCHAR(50) UNIQUE,
    user_id INTEGER REFERENCES users(id),
    loan_amount INTEGER,
    loan_tenure INTEGER,
    loan_purpose VARCHAR(50),
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE applicant_profiles (
    id SERIAL PRIMARY KEY,
    application_id VARCHAR(50),
    age INTEGER,
    date_of_birth DATE,
    gender VARCHAR(20),
    marital_status VARCHAR(20),
    pan_number VARCHAR(20),
    aadhaar_number VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20)
);


CREATE TABLE employment_details (
    id SERIAL PRIMARY KEY,
    application_id VARCHAR(50),
    employment_type VARCHAR(50),
    employer_name VARCHAR(150),
    industry VARCHAR(100),
    job_title VARCHAR(100),
    years_in_current_job INTEGER,
    total_work_experience INTEGER,
    monthly_income INTEGER,
    salary_mode VARCHAR(50)
);


CREATE TABLE financial_details (
    id SERIAL PRIMARY KEY,
    application_id VARCHAR(50),
    existing_loans INTEGER,
    existing_emi INTEGER,
    credit_card_limit INTEGER,
    credit_card_balance INTEGER,
    bank_name VARCHAR(100),
    bank_account_type VARCHAR(50),
    average_monthly_balance INTEGER
);


CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    application_id VARCHAR(50),
    bank_statement_url TEXT,
    salary_slip_url TEXT,
    itr_document_url TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE agent_results (
    id SERIAL PRIMARY KEY,
    application_id VARCHAR(50),
    credit_pd_score FLOAT,
    fraud_probability FLOAT,
    employment_verified BOOLEAN,
    final_decision VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);