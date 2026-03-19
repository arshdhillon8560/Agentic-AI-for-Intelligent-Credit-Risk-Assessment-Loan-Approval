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
            raise HTTPException(400, "application_id is required")

        print("Processing application:", application_id)

        application_data = get_application_data(application_id)

        docs = application_data["documents"]

        # ---------- OCR + EMPLOYMENT ----------
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

        # ---------- PARSE ----------
        features = extract_financial_features(text)
        structured = parse_document(text)
        structured.update(features)

        print("Parsed document data:", structured)

        # ---------- DOCUMENT CONSISTENCY ----------
        valid, reason = check_document_consistency(
            application_data["profile"],
            application_data["financial"],
            structured
        )

        if not valid:

            update_application_status(application_id, "REJECTED", reason)

            save_agent_result(
                application_id,
                0,
                1,
                False,
                "REJECTED"
            )

            return {
                "application_id": application_id,
                "decision": "REJECTED",
                "reason": reason
            }

        # ---------- CLEAN ----------
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

        # ---------- VALIDATION ----------
        validation = validate_document_data(structured)

        if not validation["valid"]:

            update_application_status(
                application_id,
                "REJECTED",
                validation["reason"]
            )

            save_agent_result(
                application_id,
                0,
                1,
                False,
                "REJECTED"
            )

            return {
                "application_id": application_id,
                "decision": "REJECTED",
                "reason": validation["reason"]
            }

        # ---------- ML ----------
        credit = get_credit_score(structured)
        fraud = get_fraud_score(structured)

        decision = make_decision(
            credit["pd_score"],
            fraud["fraud_probability"],
            employment_verified
        )

        # 🔥 FIX: Normalize decision
        decision = decision.upper()

        # ---------- FINAL STATUS ----------
        if decision == "ESCALATE":

            update_application_status(
                application_id,
                "ESCALATED",
                "Sent to credit officer for manual review"
            )

            escalate_application(application_id)

        elif decision == "APPROVED":

            update_application_status(
                application_id,
                "APPROVED",
                None
            )

        else:

            update_application_status(
                application_id,
                "REJECTED",
                "High credit risk"
            )

        # ---------- SAVE RESULT ----------
        save_agent_result(
            application_id,
            credit["pd_score"],
            fraud["fraud_probability"],
            employment_verified,
            decision
        )

        return {
            "application_id": application_id,
            "decision": decision
        }

    except Exception as e:

        print("Orchestrator error:", str(e))
        raise HTTPException(500, str(e))