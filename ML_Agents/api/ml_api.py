from fastapi import FastAPI
import joblib
import numpy as np
import os


from utils.feature_engineering import (
    compute_debt_to_income_ratio,
    compute_credit_utilization,
    compute_income_stability,
    compute_account_balance_pattern,
    compute_repayment_history_score
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODELS_DIR = os.path.join(BASE_DIR, "models")


app = FastAPI()


credit_model = joblib.load(os.path.join(MODELS_DIR, "credit_model.pkl"))
fraud_model = joblib.load(os.path.join(MODELS_DIR, "fraud_model.pkl"))
scaler = joblib.load(os.path.join(MODELS_DIR, "scaler.pkl"))


@app.get("/")
def home():
    return {"message": "ML Agents API is running"}

@app.post("/predict-credit")
def predict_credit(data: dict):

    debt_ratio = compute_debt_to_income_ratio(
        data["monthly_income"],
        data["existing_emi"]
    )

    credit_utilization = compute_credit_utilization(
        data["credit_card_balance"],
        data["credit_card_limit"]
    )

    income_stability = compute_income_stability(
        data["bank_balance_history"]
    )

    repayment_score = compute_repayment_history_score(
        data["late_payments"],
        data["total_payments"]
    )

    features = np.array([[
        data["age"],
        data["monthly_income"],
        debt_ratio,
        credit_utilization,
        data["number_of_existing_loans"],
        data["years_in_job"],
        data["credit_history_length"],
        repayment_score,
        data["loan_amount"],
        data["loan_tenure"],
        data["account_balance"],
        income_stability
    ]])

    features = scaler.transform(features)

    pd_score = credit_model.predict_proba(features)[0][1]

    if pd_score < 0.3:
        risk = "LOW"
    elif pd_score < 0.6:
        risk = "MEDIUM"
    else:
        risk = "HIGH"

    return {
        "pd_score": float(pd_score),
        "risk_band": risk
    }


@app.post("/predict-fraud")
def predict_fraud(data: dict):

    account_pattern = compute_account_balance_pattern(
        data["bank_balance_history"]
    )

    features = [[
        data["income_declared"],
        data["income_detected"],
        data["address_mismatch"],
        data["device_location"],
        data["document_authenticity_score"],
        account_pattern,
        data["employment_mismatch"],
        data["rapid_loan_requests"]
    ]]

    pred = fraud_model.predict(features)[0]
    prob = fraud_model.predict_proba(features)[0][1]

    return {
        "fraud_probability": float(prob),
        "fraud_flag": bool(pred)
    }