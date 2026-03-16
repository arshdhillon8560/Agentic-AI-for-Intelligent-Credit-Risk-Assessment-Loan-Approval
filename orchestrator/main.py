from fastapi import FastAPI, HTTPException
from concurrent.futures import ThreadPoolExecutor

from services.application_service import get_application_data
from agents.ocr_agent import extract_text
from agents.llm_parser_agent import parse_document
from agents.employment_agent import verify_employment
from agents.feature_engineering_agent import extract_financial_features

from services.ml_service import get_credit_score, get_fraud_score
from agents.decision_agent import make_decision
from services.escalation_service import escalate_application
from services.database_service import update_application_status
from services.agent_result_service import save_agent_result

from agents.document_validation_agent import validate_document_data
from utils.data_cleaner import clean_numeric, clean_balance_history
from agents.document_consistency_agent import check_document_consistency


app = FastAPI()
executor = ThreadPoolExecutor(max_workers=4)


@app.post("/process-application")
def process_application(data: dict):

    try:

        application_id = data.get("application_id")

        if not application_id:
            raise HTTPException(
                status_code=400,
                detail="application_id is required"
            )

        print("Processing application:", application_id)

        application_data = get_application_data(application_id)

        if not application_data:
            raise HTTPException(
                status_code=404,
                detail="Application not found"
            )

        docs = application_data["documents"]

        # ---------- PARALLEL STAGE 1 ----------
        ocr_future = executor.submit(
            extract_text,
            docs["bank_statement_url"]
        )

        employment_future = executor.submit(
            verify_employment,
            application_data["employment"]
        )

        text = ocr_future.result()
        employment_verified = employment_future.result()

        # ---------- DOCUMENT PARSING ----------
        features = extract_financial_features(text)
        structured = parse_document(text)
        structured.update(features)

        # ---------- DOCUMENT CONSISTENCY ----------
        valid, reason = check_document_consistency(
            application_data["profile"],
            application_data["financial"],
            structured
        )

        print("Parsed document data:", structured)

        if not valid:

            print("Document mismatch:", reason)

            update_application_status(application_id, "REJECTED")

            save_agent_result(
                application_id,
                0,
                1,
                False,
                "DOCUMENT_MISMATCH"
            )

            return {
                "application_id": application_id,
                "decision": "REJECTED",
                "reason": reason
            }

        # ---------- DATA CLEANING ----------
        structured["monthly_income"] = clean_numeric(
            structured.get("monthly_income", 50000), 50000
        )

        structured["existing_emi"] = clean_numeric(
            structured.get("existing_emi", 0), 0
        )

        structured["credit_card_balance"] = clean_numeric(
            structured.get("credit_card_balance", 0), 0
        )

        structured["credit_card_limit"] = clean_numeric(
            structured.get("credit_card_limit", 50000), 50000
        )

        structured["account_balance"] = clean_numeric(
            structured.get("account_balance", 50000), 50000
        )

        structured["bank_balance_history"] = clean_balance_history(
            structured.get("bank_balance_history", [])
        )

        # ---------- DEFAULT VALUES ----------
        structured.setdefault("age", 30)
        structured.setdefault("number_of_existing_loans", 0)
        structured.setdefault("years_in_job", 2)
        structured.setdefault("credit_history_length", 3)
        structured.setdefault("late_payments", 0)
        structured.setdefault("total_payments", 12)

        # ---------- VALIDATION ----------
        validation = validate_document_data(structured)

        if not validation["valid"]:

            print("Document validation failed:", validation["reason"])

            update_application_status(application_id, "REJECTED")

            save_agent_result(
                application_id,
                0,
                1,
                False,
                "INVALID_DOCUMENT"
            )

            return {
                "application_id": application_id,
                "decision": "REJECTED",
                "reason": validation["reason"]
            }

        # ---------- PARALLEL ML ----------
        credit_future = executor.submit(get_credit_score, structured)
        fraud_future = executor.submit(get_fraud_score, structured)

        credit = credit_future.result()
        fraud = fraud_future.result()

        # ---------- FINAL DECISION ----------
        decision = make_decision(
            credit["pd_score"],
            fraud["fraud_probability"],
            employment_verified
        )

        print("Final decision:", decision)

        save_agent_result(
            application_id,
            credit["pd_score"],
            fraud["fraud_probability"],
            employment_verified,
            decision
        )

        update_application_status(application_id, decision)

        if decision == "ESCALATE":
            escalate_application(application_id)

        return {
            "application_id": application_id,
            "decision": decision,
            "credit_score": credit["pd_score"],
            "fraud_probability": fraud["fraud_probability"],
            "employment_verified": employment_verified
        }

    except Exception as e:

        print("Orchestrator error:", str(e))

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )