def build_credit_features(application,profile,employment,financial,ocr_data):

    features = {

        "age":profile[2],

        "monthly_income":employment[8],

        "existing_emi":financial[3],

        "credit_card_balance":financial[4],

        "credit_card_limit":financial[3],

        "number_of_existing_loans":financial[2],

        "years_in_job":employment[5],

        "credit_history_length":6,

        "late_payments":1,

        "total_payments":24,

        "loan_amount":application[3],

        "loan_tenure":application[4],

        "account_balance":ocr_data["account_balance"],

        "bank_balance_history":ocr_data["bank_balance_history"]

    }

    return features


def build_fraud_features(employment,ocr_data):

    features = {

        "income_declared":employment[8],

        "income_detected":ocr_data["monthly_income"],

        "address_mismatch":0,

        "device_location":1,

        "document_authenticity_score":ocr_data["document_authenticity_score"],

        "employment_mismatch":0,

        "rapid_loan_requests":0,

        "bank_balance_history":ocr_data["bank_balance_history"]

    }

    return features