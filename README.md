# AI Agent Loan Approval System

An intelligent, automated loan approval platform that uses AI agents, machine learning, and document verification to process loan applications efficiently. The system evaluates loan eligibility through document analysis, credit scoring, fraud detection, and employment verification while routing complex cases to human officers for final review.

---

## 🎯 Overview

This is a **production-ready intelligent lending platform** that automates 80% of loan approvals through AI while maintaining human oversight for complex cases. The system processes loan applications through a sophisticated pipeline of AI agents, machine learning models, and validation checks to make informed lending decisions.

**Key Capabilities:**
- ✅ End-to-end automated loan application processing
- ✅ AI-powered document analysis (OCR + LLM parsing)
- ✅ Credit risk assessment and fraud detection
- ✅ Employment and financial verification
- ✅ Intelligent decision engine with automatic escalation
- ✅ Officer dashboard for manual review of escalated cases
- ✅ Real-time application status tracking

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│            User Interfaces (React + TypeScript)             │
│  ┌─────────────────────┬─────────────────────────────────┐  │
│  │ Applicant Portal    │      Officer Portal             │  │
│  │ (Loan Application   │      (Escalated Cases Review)   │  │
│  │  & Status Tracking) │                                 │  │
│  └──────────┬──────────┴──────────────────┬──────────────┘  │
└─────────────┼───────────────────────────────┼────────────────┘
              │                               │
              └───────────────┬───────────────┘
                              ▼
                  ┌──────────────────────────┐
                  │   Backend API Gateway    │
                  │  (Express.js + Auth)     │
                  │   Port: 5000             │
                  └──────────────┬───────────┘
                                 │
                ┌────────────────┼────────────────┐
                ▼                ▼                ▼
        ┌────────────────┐ ┌──────────────┐ ┌─────────────┐
        │  Orchestrator  │ │ ML_Agents    │ │ PostgreSQL  │
        │  (FastAPI)     │ │ API (FastAPI)│ │ Database    │
        │  Port: 9000    │ │ Port: 8000   │ │             │
        └────────┬───────┘ └──────┬───────┘ └─────────────┘
                 │                │
        ┌────────┴────────────────┴──────┐
        │   Document Processing Pipeline │
        │  • OCR (Tesseract)             │
        │  • LLM Parser (Groq)           │
        │  • Validation & Consistency    │
        │  • Feature Engineering         │
        │  • ML Credit & Fraud Models    │
        └────────────────────────────────┘
```

**Data Flow:**
1. Applicant submits loan application with documents via Frontend
2. Backend stores personal, employment, and financial data in PostgreSQL
3. Backend sends application to Orchestrator for processing
4. Orchestrator runs AI agents pipeline:
   - OCR extracts text from PDF documents
   - LLM Parser structures the data
   - Validators check consistency and accuracy
   - Feature Engineer computes financial metrics
   - Employment Agent verifies job history
5. ML_Agents API provides credit risk and fraud predictions
6. Decision Agent makes final decision (APPROVED/REJECTED/ESCALATED)
7. Result stored and returned to user
8. Officer reviews escalated cases on Officer Dashboard

---

## 🌟 Key Features

### Authentication & Authorization
- JWT-based authentication with role-based access control (RBAC)
- Separate user roles: Applicant, Officer, Admin
- Secure password hashing with bcryptjs

### Loan Application System
- **Step-by-step multi-form application process**
  - Personal Information (name, age, PAN, Aadhaar)
  - Employment Details (company, salary, experience, designation)
  - Financial Profile (income, existing loans, credit cards, bank balances)
- **Document Upload System**
  - Bank statements, salary slips, ITR documents
  - Cloud storage via Cloudinary
  - File validation and virus scanning

### KYC (Know Your Customer) Verification
- PAN verification via NSDL API integration
- Aadhaar-based OTP verification
- Real-time validation

### AI-Powered Document Analysis
- **OCR Agent:** Extracts text from PDF documents using Tesseract
- **LLM Parser Agent:** Converts unstructured text to structured JSON using Groq LLM
- **Document Validator Agent:** Validates critical financial fields
- **Consistency Agent:** Cross-validates information across multiple documents
- **Employment Agent:** Verifies employment continuity (minimum 1 year current job)

### Machine Learning Models
- **Credit Risk Assessment:**
  - XGBoost-based Probability of Default (PD) calculation
  - Features: income, loans, credit utilization, balance stability
  - Output: Risk bands (LOW, MEDIUM, HIGH)
- **Fraud Detection:**
  - Identifies suspicious patterns and anomalies
  - Analyzes income consistency and account behavior
  - Detects location and device anomalies

### Intelligent Decision Engine
- **Automatic Decision Logic:**
  - Fraud probability > 70% → REJECTED
  - PD Score > 0.6 → REJECTED
  - Employment not verified → ESCALATED
  - PD Score 0.4-0.6 (borderline) → ESCALATED
  - All criteria met → APPROVED
- **Automatic Escalation:** Complex cases routed to officers

### Officer Dashboard
- View all escalated loan applications
- Access complete application details with all documents
- Download and review documents
- Make final approval/rejection decisions with notes
- Track decision history

### Application Status Tracking
- Real-time status updates (PENDING → IN_REVIEW → ESCALATED/APPROVED/REJECTED)
- User notifications for decision outcomes
- Complete audit trail

---

## 📊 Technology Stack

| Component | Technologies | Version |
|-----------|---------------|---------|
| **Backend API** | Node.js, Express.js, PostgreSQL | Node 16+, Express 5.2, PostgreSQL 12+ |
| **Frontend (Applicant)** | React, TypeScript, Tailwind CSS, Vite | React 18.3, TS 5.x |
| **Officer Portal** | React, Tailwind CSS | React 19.2 |
| **Orchestrator** | FastAPI, Python, Groq LLM | Python 3.8+, FastAPI 0.104+ |
| **ML Service** | FastAPI, scikit-learn, XGBoost | Python 3.8+, scikit-learn 1.3+ |
| **Document Processing** | Tesseract OCR, pdf2image, poppler | Tesseract 5.x |
| **Cloud Storage** | Cloudinary | v1.x |
| **Authentication** | JWT, bcryptjs | jsonwebtoken 9.x, bcryptjs 2.4+ |
| **File Upload** | Multer | 2.1+ |

---

## 📁 Project Structure

```
AI Agent Loan Approval System/
│
├── backend/                           # Express.js API Gateway
│   ├── app.js                         # Main server file
│   ├── package.json                   # Dependencies
│   ├── testDB.js                      # Database connection test
│   ├── config/
│   │   ├── cloudinary.js              # Cloudinary configuration
│   │   └── db.js                      # PostgreSQL connection config
│   ├── controllers/                   # Business logic
│   │   ├── authController.js          # Authentication
│   │   ├── applicationController.js   # Application management
│   │   ├── kycController.js           # KYC verification
│   │   └── officerController.js       # Officer operations
│   ├── models/                        # Data models
│   │   ├── userModel.js               # User model
│   │   └── applicationModel.js        # Application model
│   ├── routes/                        # API routes
│   │   ├── authRoutes.js              # /auth endpoints
│   │   ├── applicationRoutes.js       # /application endpoints
│   │   ├── kycRoutes.js               # /kyc endpoints
│   │   └── officerRoutes.js           # /officer endpoints
│   ├── middleware/                    # Custom middleware
│   │   ├── authMiddleware.js          # JWT verification
│   │   ├── roleMiddleware.js          # Role-based access control
│   │   └── uploadMiddleware.js        # File upload handling
│   ├── services/
│   │   ├── kycService.js              # KYC service logic
│   │   └── orchestratorService.js     # Orchestrator integration
│   ├── database/
│   │   └── schema.sql                 # Database schema
│   ├── uploads/
│   │   └── documents/                 # Temporary document storage
│   └── utils/
│       └── generateApplicationId.js   # Helper utilities
│
├── frontend/                          # React Applicant Portal
│   ├── package.json
│   ├── vite.config.ts                 # Vite configuration
│   ├── src/
│   │   ├── main.tsx                   # Root component
│   │   ├── App.tsx                    # Main app component
│   │   ├── index.css                  # Global styles
│   │   ├── components/                # Reusable components
│   │   │   ├── ApplicationForm.jsx    # Application creation
│   │   │   ├── ProfileForm.jsx        # Personal info form
│   │   │   ├── EmploymentForm.jsx     # Employment details form
│   │   │   ├── FinancialForm.jsx      # Financial details form
│   │   │   ├── DocumentUpload.jsx     # Document upload component
│   │   │   ├── KYCVerification.jsx    # KYC verification
│   │   │   └── ProtectedRoute.jsx     # Protected route wrapper
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx        # Auth state management
│   │   ├── pages/                     # Page components
│   │   │   └── ApplicationStatus.jsx  # Status tracking page
│   │   └── services/                  # API integration services
│   ├── tailwind.config.js
│   └── index.html
│
├── Officer/                           # React Officer Portal
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx                    # Officer dashboard
│   │   ├── App.css
│   │   ├── components/                # Officer-specific components
│   │   ├── pages/                     # Dashboard pages
│   │   └── services/                  # API services
│   ├── public/
│   └── index.html
│
├── orchestrator/                      # FastAPI Orchestrator
│   ├── main.py                        # FastAPI app entry point
│   ├── requirements.txt                # Python dependencies
│   ├── test_gemini.py                 # LLM testing
│   ├── agents/                        # AI Agent implementations
│   │   ├── ocr_agent.py               # Document OCR
│   │   ├── llm_parser_agent.py        # LLM-based parsing
│   │   ├── feature_engineering_agent.py  # Feature extraction
│   │   ├── document_validation_agent.py  # Data validation
│   │   ├── document_consistency_agent.py # Cross-document validation
│   │   ├── employment_agent.py        # Employment verification
│   │   └── decision_agent.py          # Final decision making
│   ├── config/
│   │   └── settings.py                # Configuration
│   ├── database/
│   │   └── db.py                      # Database operations
│   ├── services/
│   │   ├── agent_result_service.py    # Result storage
│   │   ├── application_service.py     # App service layer
│   │   ├── database_service.py        # DB service layer
│   │   ├── escalation_service.py      # Escalation logic
│   │   └── ml_service.py              # ML model integration
│   └── utils/
│       ├── data_cleaner.py            # Data cleaning utilities
│       └── feature_builder.py         # Feature engineering utilities
│
├── ML_Agents/                         # FastAPI ML Service
│   ├── api/
│   │   └── ml_api.py                  # ML API endpoints
│   ├── models/                        # Trained ML models
│   │   ├── credit_model.pkl           # Credit risk model
│   │   ├── fraud_model.pkl            # Fraud detection model
│   │   └── scaler.pkl                 # Feature scaler
│   ├── training/
│   │   ├── train_credit_model.py      # Credit model training
│   │   └── train_fraud_model.py       # Fraud model training
│   ├── datasets/
│   │   ├── loan_credit_pd_dataset_50k.csv
│   │   └── loan_fraud_detection_dataset_50k.csv
│   ├── utils/
│   │   └── feature_engineering.py     # Feature extraction
│   ├── requirements.txt
│   └── start.sh                       # Startup script
│
└── README.md                          # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 16+** and npm
- **Python 3.8+** with pip
- **PostgreSQL 12+**
- **Git**
- **Tesseract OCR** (for document processing)
- **Poppler** (for PDF handling)
- **API Keys:**
  - Cloudinary (for document storage)
  - Groq LLM API (for document parsing)
  - NSDL API (optional, for PAN verification)

### 1. Install System Dependencies

#### Windows

**Tesseract OCR:**
```bash
# Download from: https://github.com/UB-Mannheim/tesseract/wiki
# Or use Chocolatey:
choco install tesseract-ocr
# Default path: C:\Program Files\Tesseract-OCR\tesseract.exe
```

**Poppler:**
```bash
# Download from: https://github.com/oschwartz10612/poppler-windows/releases/
# Extract to: C:\poppler
```

#### macOS
```bash
brew install tesseract
brew install poppler
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get install tesseract-ocr
sudo apt-get install poppler-utils
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb loan_approval_db

# Run schema script
psql -U postgres -d loan_approval_db -f backend/database/schema.sql

# Verify connection
npm run testDB  # (from backend directory)
```

### 3. Clone and Install Dependencies

```bash
# Clone repository
git clone <repository-url>
cd "AI Agent Loan Approval System"

# Backend
cd backend
npm install

# Frontend (Applicant Portal)
cd ../frontend
npm install

# Officer Portal
cd ../Officer
npm install

# Orchestrator
cd ../orchestrator
pip install -r requirements.txt

# ML Service
cd ../ML_Agents
pip install -r requirements.txt
```

### 4. Environment Configuration

Create `.env` files in each service:

**`backend/.env`**
```env
# Database Connection
DB_HOST=localhost
DB_PORT=5432
DB_NAME=loan_approval_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_secret_jwt_key_here

# Cloudinary (Document Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ML Services
ML_CREDIT_API=http://localhost:8000/predict-credit
ML_FRAUD_API=http://localhost:8000/predict-fraud
ORCHESTRATOR_API=http://localhost:9000/process-application

# LLM (Groq)
GROQ_API_KEY=your_groq_api_key

# File Upload
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_DIR=uploads/documents

# Optional: Gemini API for advanced features
GEMINI_API_KEY=your_gemini_api_key
```

**`orchestrator/.env`**
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=loan_approval_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# Port
PORT=9000

# LLM
GROQ_API_KEY=your_groq_api_key

# ML Service
ML_SERVICE_URL=http://localhost:8000

# Tesseract Path (Windows)
TESSERACT_PATH=C:\Program Files\Tesseract-OCR\tesseract.exe

# Poppler Path (Windows)
POPPLER_PATH=C:\poppler\Library\bin
```

**`ML_Agents/.env`**
```env
PORT=8000
MODEL_PATH=models/
CREDIT_MODEL=credit_model.pkl
FRAUD_MODEL=fraud_model.pkl
SCALER=scaler.pkl
```

---

## 🏃 Running the Application

### Start PostgreSQL
```bash
# Windows
net start postgresql-x64-15

# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### Terminal 1: Backend API Gateway
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

### Terminal 2: Orchestrator Service
```bash
cd orchestrator
uvicorn main:app --port 9000 --reload
# Service runs on http://localhost:9000
```

### Terminal 3: ML Service
```bash
cd ML_Agents
bash start.sh
# OR: uvicorn api.ml_api:app --port 8000 --reload
# Service runs on http://localhost:8000
```

### Terminal 4: Frontend (Applicant Portal)
```bash
cd frontend
npm run dev
# Portal runs on http://localhost:5173
```

### Terminal 5: Officer Portal
```bash
cd Officer
npm run dev
# Portal runs on http://localhost:5174
```

**All services running:**
- 🌐 Applicant Portal: http://localhost:5173
- 👮 Officer Portal: http://localhost:5174
- 🔌 Backend API: http://localhost:5000
- 🤖 Orchestrator: http://localhost:9000
- 🧠 ML Service: http://localhost:8000
- 📊 PostgreSQL: localhost:5432

---

## 📡 API Documentation

### Authentication (`/auth`)

**Register New Applicant**
```http
POST /auth/signup
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "user@example.com",
  "password": "securepassword",
  "phone_number": "+91-9876543210"
}

Response: 
{
  "message": "Signup successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "applicant"
  }
}
```

**Login**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response:
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "applicant"
  }
}
```

### Loan Application (`/application`)

**Create Application**
```http
POST /application/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "loan_amount": 500000,
  "loan_tenure": 60,
  "loan_purpose": "Home Purchase"
}

Response:
{
  "message": "Application created successfully",
  "application_id": "APP-20260325-001"
}
```

**Save Personal Information**
```http
POST /application/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "application_id": "APP-20260325-001",
  "name": "John Doe",
  "age": 35,
  "date_of_birth": "1990-09-15",
  "gender": "Male",
  "marital_status": "Married",
  "pan_number": "ABCDE1234F",
  "aadhaar_number": "123456789012",
  "address": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001"
}

Response:
{
  "message": "Applicant profile saved successfully"
}
```

**Save Employment Details**
```http
POST /application/employment
Authorization: Bearer <token>
Content-Type: application/json

{
  "application_id": "APP-20260325-001",
  "employment_type": "Salaried",
  "employer_name": "Tech Corp Ltd",
  "industry": "Technology",
  "job_title": "Senior Developer",
  "years_in_current_job": 5,
  "total_work_experience": 10,
  "monthly_income": 75000,
  "salary_mode": "Bank Transfer"
}

Response:
{
  "message": "Employment details saved successfully"
}
```

**Save Financial Details**
```http
POST /application/financial
Authorization: Bearer <token>
Content-Type: application/json

{
  "application_id": "APP-20260325-001",
  "existing_loans": 200000,
  "existing_emi": 5000,
  "credit_card_limit": 100000,
  "credit_card_balance": 50000,
  "bank_name": "HDFC Bank",
  "bank_account_type": "Savings",
  "bank_account_number": "1234567890",
  "average_monthly_balance": 750000
}

Response:
{
  "message": "Financial details saved successfully"
}
```

**Upload Documents**
```http
POST /application/upload-documents
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body (multipart):
- application_id: "APP-20260325-001"
- bank_statement: <file> (PDF)
- salary_slip: <file> (PDF)
- itr_document: <file> (PDF)

Response:
{
  "message": "Documents uploaded successfully",
  "bank_statement_url": "https://cloudinary.com/...",
  "salary_slip_url": "https://cloudinary.com/...",
  "itr_document_url": "https://cloudinary.com/..."
}
```

**Get All User Applications**
```http
GET /application/all
Authorization: Bearer <token>

Response:
[
  {
    "application_id": "APP-20260325-001",
    "status": "PROCESSING",
    "kyc_status": "VERIFIED",
    "created_at": "2026-03-25T10:30:00Z"
  },
  ...
]
```

**Process Application**
```http
POST /application/process
Authorization: Bearer <token>
Content-Type: application/json

{
  "application_id": "APP-20260325-001"
}

Response: 
{
  "status": "processed",
  "decision": "APPROVED/REJECTED/ESCALATED",
  "scores": { ... },
  "message": "Application processed successfully"
}
```

**Get Application Status**
```http
GET /application/status/:id
Authorization: Bearer <token>

Response:
{
  "application_id": "APP-20260325-001",
  "status": "ESCALATED",
  "kyc_status": "VERIFIED",
  "reason": null,
  "created_at": "2026-03-25T10:30:00Z",
  "credit_pd_score": 0.35,
  "fraud_probability": 0.05,
  "employment_verified": true,
  "final_decision": "ESCALATED",
  "user_message": "Your application is under review by credit officer",
  "agent_scores": {
    "credit_pd_score": 0.35,
    "fraud_probability": 0.05,
    "employment_verified": true,
    "final_decision": "ESCALATED"
  }
}
```

### KYC Verification (`/kyc`)

**Verify PAN**
```http
POST /kyc/verify-pan
Content-Type: application/json

{
  "application_id": "APP-20260325-001",
  "pan": "ABCDE1234F",
  "name": "John Doe",
  "dob": "1990-09-15"
}

Response:
{
  "message": "PAN verification successful",
  "data": {
    "status": "valid",
    ...
  }
}
// On failure:
{
  "message": "PAN verification failed",
  "application_status": "REJECTED"
}
```

**Send Aadhaar OTP**
```http
POST /kyc/aadhaar/send-otp
Content-Type: application/json

{
  "aadhaar": "123456789012"
}

Response:
{
  "reference_id": "ref_12345",
  "message": "OTP sent successfully"
}
```

**Verify Aadhaar OTP**
```http
POST /kyc/aadhaar/verify-otp
Content-Type: application/json

{
  "application_id": "APP-20260325-001",
  "reference_id": "ref_12345",
  "otp": "123456"
}

Response (on success):
{
  "message": "KYC successful",
  "orchestrator": { ... }
}
// On failure:
{
  "message": "Aadhaar verification failed",
  "application_status": "REJECTED"
}
```

### Officer Routes (`/officer`)

**Get Escalated Applications**
```http
GET /officer/escalated
Authorization: Bearer <officer-token>

Response:
{
  "count": 5,
  "applications": [
    {
      "application_id": "APP-20260325-001",
      "user_id": 1,
      "loan_amount": 500000,
      "loan_tenure": 60,
      "loan_purpose": "Home Purchase",
      "created_at": "2026-03-25T10:30:00Z"
    },
    ...
  ]
}
```

**Get Application Details**
```http
GET /officer/application/:id
Authorization: Bearer <officer-token>

Response:
{
  "application": { ... },
  "profile": { ... },
  "employment": { ... },
  "financial": { ... },
  "documents": { ... },
  "agent_result": { ... }
}
```

**Make Officer Decision**
```http
POST /officer/decision
Authorization: Bearer <officer-token>
Content-Type: application/json

{
  "application_id": "APP-20260325-001",
  "decision": "APPROVED",
  "reason": "Good income, stable employment"
}

Response:
{
  "message": "Decision updated successfully",
  "application_id": "APP-20260325-001",
  "status": "APPROVED",
  "reason": "Good income, stable employment"
}
```

### ML APIs (Port 8000)

**Health Check**
```http
GET /
Response:
{
  "message": "ML Agents API is running"
}
```

**Credit Risk Prediction**
```http
POST /predict-credit
Content-Type: application/json

{
  "age": 35,
  "monthly_income": 75000,
  "existing_emi": 5000,
  "credit_card_balance": 50000,
  "credit_card_limit": 100000,
  "number_of_existing_loans": 2,
  "years_in_job": 5,
  "credit_history_length": 10,
  "late_payments": 0,
  "total_payments": 60,
  "loan_amount": 500000,
  "loan_tenure": 60,
  "account_balance": 750000,
  "bank_balance_history": [750000, 725000, 700000, ...]
}

Response:
{
  "pd_score": 0.35,
  "risk_band": "LOW"
}
```

**Fraud Detection**
```http
POST /predict-fraud
Content-Type: application/json

{
  "income_declared": 75000,
  "income_detected": 72000,
  "address_mismatch": 0,
  "device_location": 0,
  "document_authenticity_score": 0.95,
  "employment_mismatch": 0,
  "rapid_loan_requests": 0,
  "bank_balance_history": [750000, 725000, 700000, ...]
}

Response:
{
  "fraud_probability": 0.08,
  "fraud_flag": false
}
```

---

## 💾 Database Schema

### Key Tables

**users**
```sql
- user_id (PK)
- email (UNIQUE)
- password_hash
- full_name
- user_type (applicant, officer, admin)
- kyc_verified
- created_at
```

**applications**
```sql
- id (PK)
- application_id (UNIQUE)
- user_id (FK)
- loan_amount
- loan_tenure
- loan_purpose
- status (PENDING, IN_REVIEW, ESCALATED, APPROVED, REJECTED)
- kyc_status
- reason
- created_at
- updated_at
```

**applicant_profiles**
```sql
- id (PK)
- application_id (FK)
- name
- age
- date_of_birth
- gender
- marital_status
- pan_number
- aadhaar_number
- address
- city
- state
- pincode
```

**employment_details**
```sql
- id (PK)
- application_id (FK)
- employment_type
- employer_name
- industry
- job_title
- years_in_current_job
- total_work_experience
- monthly_income
- salary_mode
```

**financial_details**
```sql
- id (PK)
- application_id (FK)
- existing_loans
- existing_emi
- credit_card_limit
- credit_card_balance
- bank_name
- bank_account_type
- average_monthly_balance
- bank_account_number
```

**documents**
```sql
- id (PK)
- application_id (FK)
- bank_statement_url
- salary_slip_url
- itr_document_url
- uploaded_at
```

**agent_results**
```sql
- id (PK)
- application_id (FK)
- credit_pd_score
- fraud_probability
- employment_verified
- final_decision
- created_at
```

---

## 🧠 Machine Learning Models

### Credit Risk Model (LogisticRegression - Best Performer)

**Input Features:**
- Age
- Annual Income
- Existing Loans
- Debt-to-Income Ratio
- Credit Utilization Rate
- Bank Balance
- Balance Stability Score
- Loan Tenure

**Output:**
- Probability of Default (PD): 0-1 (higher = more risky)
- Risk Band: LOW (<0.3), MEDIUM (0.3-0.6), HIGH (>0.6)

**Decision Logic:**
- PD > 0.6 → REJECT
- PD 0.4-0.6 → ESCALATE
- PD < 0.4 → APPROVE (if other checks pass)

**Model Performance Comparison (Trained on 10,000 test samples):**

| Model | Accuracy | AUC | Precision | Recall | F1 Score |
|-------|----------|-----|-----------|--------|----------|
| RandomForest | 97.71% | 0.9973 | 0.9756 | 0.8971 | 0.9347 |
| **LogisticRegression** | **99.82%** | **1.0000** | **0.9989** | **0.9912** | **0.9951** |
| XGBoost | 99.09% | 0.9996 | 0.9838 | 0.9661 | 0.9749 |

**Selected Model:** LogisticRegression (Best AUC and highest precision/recall balance)

**Confusion Matrix (LogisticRegression):**
```
              Predicted No Default    Predicted Default
Actual No Default:      8171                    2
Actual Default:           16                 1811
```

### Fraud Detection Model (XGBoost - Best Performer)

**Input Features:**
- Income mismatch percentage
- Location anomaly score
- Device anomaly score
- Account volatility
- Document consistency score

**Output:**
- Fraud Probability: 0-1
- Decision: > 0.7 → REJECT

**Model Performance Comparison (Trained on 10,000 test samples):**

| Model | Accuracy | AUC | Precision | Recall | F1 Score |
|-------|----------|-----|-----------|--------|----------|
| RandomForest | 99.44% | 0.9985 | 0.8140 | 0.6364 | 0.7143 |
| **XGBoost** | **99.57%** | **0.9987** | **0.8317** | **0.7636** | **0.7962** |

**Selected Model:** XGBoost (Highest accuracy, precision, and F1 score; excellent fraud detection)

**Confusion Matrix (XGBoost):**
```
              Predicted Non-Fraud    Predicted Fraud
Actual Non-Fraud:    9873                    17
Actual Fraud:           26                   84
```

### Training Data
- Credit Model: 50k+ loan records with 20+ financial features
- Fraud Model: 50k+ records with labeled fraud/non-fraud cases
- Test Set: 10,000 samples for each model evaluation

---

## 🔐 Security Features

✅ **Authentication & Authorization**
- JWT-based token authentication
- Role-based access control (RBAC)
- Secure password hashing (bcryptjs)

✅ **Data Protection**
- HTTPS/TLS support ready
- Sensitive data encryption in transit
- SQL injection prevention (parameterized queries)
- XSS protection

✅ **API Security**
- CORS configuration
- Rate limiting (ready to implement)
- Input validation and sanitization

✅ **Document Security**
- Cloudinary secure URL hosting
- File type validation
- File size limits

---

## 🧪 Testing

### Test Database Connection
```bash
cd backend
npm run testDB
```

### Test ML Models
```bash
cd ML_Agents
python -c "import joblib; print(joblib.load('models/credit_model.pkl'))"
```

### Test Orchestrator
```bash
cd orchestrator
python test_gemini.py
```

---

## 📋 Common Workflows

### Workflow 1: Submit and Track Application
1. Applicant signs up at portal
2. Creates new loan application
3. Fills out personal, employment, financial details
4. Uploads 3 required documents
5. Submits for processing
6. System processes documents through AI pipeline
7. Receives automatic decision or escalation
8. Tracks status on dashboard

### Workflow 2: Officer Reviews Escalated Case
1. Officer logs into Officer Portal
2. Sees list of escalated applications
3. Clicks on application to view details
4. Reviews parsed document data, scores, and AI recommendations
5. Downloads original documents if needed
6. Makes final approval/rejection decision
7. Decision recorded and applicant notified

### Workflow 3: Internal: Document Processing
1. Backend receives loan application submission
2. Sends to Orchestrator via HTTP
3. Orchestrator extracts documents from URLs
4. OCR Agent processes PDFs → text extraction
5. LLM Parser Agent → structured JSON
6. Feature Engineer Agent → financial metrics
7. Validators check consistency and critical fields
8. Employment Agent verifies job history
9. ML Service provides credit score and fraud probability
10. Decision Agent applies rules → final decision
11. Results returned to Backend
12. Decision stored in database

---

## 🐛 Troubleshooting

### Issue: "Tesseract not found"
**Solution:** 
- Windows: Install from https://github.com/UB-Mannheim/tesseract/wiki
- Update environment variable: `TESSERACT_PATH=C:\Program Files\Tesseract-OCR\tesseract.exe`

### Issue: "Database connection refused"
**Solution:**
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Start PostgreSQL service
net start postgresql-x64-15  # Windows
brew services start postgresql  # macOS
sudo systemctl start postgresql  # Linux
```

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Kill process on port 5000
netstat -ano | findstr :5000  # Windows - find PID
taskkill /PID <PID> /F        # Windows - kill process

lsof -ti:5000 | xargs kill -9  # macOS/Linux
```

### Issue: "Cloudinary upload fails"
**Solution:**
- Verify CLOUDINARY_* environment variables in `.env`
- Check Cloudinary account is active
- Verify file size < 10MB

### Issue: "ML prediction errors"
**Solution:**
- Ensure ML service is running: `http://localhost:8000`
- Check input features match model expectations
- Verify trained models exist in `ML_Agents/models/`

### Issue: "Groq API errors"
**Solution:**
- Verify `GROQ_API_KEY` is set and valid
- Check API key has sufficient quota
- Monitor rate limiting

---

## 📈 Performance Tips

1. **Database Optimization:**
   - Add indexes on frequently queried columns (user_id, application_id)
   - Regular VACUUM and ANALYZE

2. **API Optimization:**
   - Enable caching for ML predictions
   - Batch document processing for multiple applications

3. **Frontend:**
   - Use code splitting for faster page loads
   - Implement service workers for offline support

4. **ML Models:**
   - Cache model predictions for identical inputs
   - Periodically retrain with new data

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Submit pull request

---

## 📄 License

[Specify your license here]

---

## 📞 Support

For issues, questions, or contributions, please contact the development team or open an issue in the repository.

---

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [scikit-learn Documentation](https://scikit-learn.org/)
- [XGBoost Documentation](https://xgboost.readthedocs.io/)

---

**Last Updated:** March 2026
**Project Version:** 1.0.0
