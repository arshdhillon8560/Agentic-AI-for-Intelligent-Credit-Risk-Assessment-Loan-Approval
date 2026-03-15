from fastapi import FastAPI
from concurrent.futures import ThreadPoolExecutor

from services.application_service import get_application_data
from agents.ocr_agent import extract_text
from agents.llm_parser_agent import parse_document
from agents.employment_agent import verify_employment
from services.ml_service import get_credit_score, get_fraud_score
from agents.decision_agent import make_decision
from services.escalation_service import escalate_application
from agents.feature_engineering_agent import extract_financial_features

app = FastAPI()

executor = ThreadPoolExecutor(max_workers=4)


@app.post("/process-application")
def process_application(data: dict):

    application_id = data["application_id"]

    application_data = get_application_data(application_id)

    docs = application_data["documents"]

    # ---------- PARALLEL STAGE 1 ----------
    ocr_future = executor.submit(extract_text, docs["bank_statement_url"])
    employment_future = executor.submit(
        verify_employment, application_data["employment"]
    )

    text = ocr_future.result()
    employment_verified = employment_future.result()

    # ---------- LLM PARSER ----------
    features = extract_financial_features(text)
    structured = parse_document(text)
    structured.update(features)

    # ---------- PARALLEL STAGE 2 ----------
    credit_future = executor.submit(get_credit_score, structured)
    fraud_future = executor.submit(get_fraud_score, structured)

    credit = credit_future.result()
    fraud = fraud_future.result()

    # ---------- DECISION ----------
    decision = make_decision(
        credit["pd_score"],
        fraud["fraud_probability"],
        employment_verified
    )

    if decision == "ESCALATE":
        escalate_application(application_id)

    return {
        "application_id": application_id,
        "decision": decision,
        "credit": credit,
        "fraud": fraud
    }