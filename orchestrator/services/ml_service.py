import os
import requests
from dotenv import load_dotenv

load_dotenv()

CREDIT_API = os.getenv("ML_CREDIT_API")
FRAUD_API = os.getenv("ML_FRAUD_API")


def safe(data, key, default):
    """
    Safely fetch value from parsed data.
    Returns default if key is missing or None.
    """
    value = data.get(key)
    return default if value is None else value


# ---------------- CREDIT MODEL ----------------

def get_credit_score(data):

    payload = {
        "age": safe(data, "age", 30),
        "monthly_income": safe(data, "monthly_income", 50000),
        "existing_emi": safe(data, "existing_emi", 0),
        "credit_card_balance": safe(data, "credit_card_balance", 0),
        "credit_card_limit": safe(data, "credit_card_limit", 1),
        "number_of_existing_loans": safe(data, "number_of_existing_loans", 0),
        "years_in_job": safe(data, "years_in_job", 1),
        "credit_history_length": safe(data, "credit_history_length", 1),
        "late_payments": safe(data, "late_payments", 0),
        "total_payments": safe(data, "total_payments", 1),
        "loan_amount": safe(data, "loan_amount", 200000),
        "loan_tenure": safe(data, "loan_tenure", 36),
        "account_balance": safe(data, "account_balance", 50000),
        "bank_balance_history": safe(data, "bank_balance_history", [50000, 52000])
    }

    print("CREDIT PAYLOAD:", payload)

    try:

        response = requests.post(CREDIT_API, json=payload, timeout=10)

        print("CREDIT API STATUS:", response.status_code)
        print("CREDIT API RESPONSE:", response.text)

        if response.status_code != 200:
            raise Exception(response.text)

        return response.json()

    except Exception as e:

        print("CREDIT API ERROR:", e)

        return {
            "pd_score": 0.3,
            "risk_band": "MEDIUM"
        }


# ---------------- FRAUD MODEL ----------------

def get_fraud_score(data):

    payload = {
        "income_declared": safe(data, "monthly_income", 50000),
        "income_detected": safe(data, "monthly_income", 50000),
        "address_mismatch": 0,
        "device_location": 0,
        "document_authenticity_score": 0.9,
        "bank_balance_history": safe(data, "bank_balance_history", [50000, 52000]),
        "employment_mismatch": 0,
        "rapid_loan_requests": 0
    }

    print("FRAUD PAYLOAD:", payload)

    try:

        response = requests.post(FRAUD_API, json=payload, timeout=10)

        print("FRAUD API STATUS:", response.status_code)
        print("FRAUD API RESPONSE:", response.text)

        if response.status_code != 200:
            raise Exception(response.text)

        return response.json()

    except Exception as e:

        print("FRAUD API ERROR:", e)

        return {
            "fraud_probability": 0.2
        }