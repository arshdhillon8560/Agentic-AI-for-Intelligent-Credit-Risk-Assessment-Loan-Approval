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
from utils.data_cleaner import clean_balance_history
from agents.document_consistency_agent import check_document_consistency

app = FastAPI()
executor = ThreadPoolExecutor(max_workers=4)


@app.post("/process-application")
def process_application(data: dict):

    try:
        application_id = data.get("application_id")

        if not application_id:
            raise HTTPException(400, "application_id is required")

        print("\n==============================")
        print("Processing application:", application_id)

        application_data = get_application_data(application_id)
        docs = application_data["documents"]

        # ---------- OCR ----------
        bank_text = extract_text(docs["bank_statement_url"])
        salary_text = extract_text(docs["salary_slip_url"])
        itr_text = extract_text(docs["itr_document_url"])

        combined_text = bank_text + "\n" + salary_text + "\n" + itr_text

        print("\nOCR SAMPLE:\n", combined_text[:800])

        # ---------- FEATURE EXTRACTION ----------
        features = extract_financial_features(combined_text)

        # ---------- PARSE ----------
        structured = parse_document(combined_text)
        structured.update(features)

        print("\nParsed document data:", structured)

        # ---------- DOCUMENT CONSISTENCY ----------
        valid, reason = check_document_consistency(
            application_data["profile"],
            application_data["financial"],
            structured
        )

        if not valid:
            update_application_status(application_id, "REJECTED", reason)

            save_agent_result(application_id, 0, 1, False, "REJECTED")

            return {
                "application_id": application_id,
                "decision": "REJECTED",
                "reason": reason
            }

        # ---------- CLEAN DOCUMENT DATA ----------
        structured["bank_balance_history"] = clean_balance_history(
            structured.get("bank_balance_history")
        )

        # ---------- VALIDATION ----------
        validation = validate_document_data(structured)

        if not validation["valid"]:
            update_application_status(
                application_id,
                "REJECTED",
                validation["reason"]
            )

            save_agent_result(application_id, 0, 1, False, "REJECTED")

            return {
                "application_id": application_id,
                "decision": "REJECTED",
                "reason": validation["reason"]
            }

        # ---------- ML INPUT FROM DB ----------
        profile = application_data["profile"]
        employment = application_data["employment"]
        financial = application_data["financial"]
        application = application_data["application"]

        ml_input = {
            "age": profile["age"],
            "monthly_income": employment["monthly_income"],
            "existing_emi": financial["existing_emi"],
            "credit_card_balance": financial["credit_card_balance"],
            "credit_card_limit": financial["credit_card_limit"],
            "number_of_existing_loans": financial["existing_loans"],

            # ✅ FIX (NO ERROR NOW)
            "years_in_job": employment.get("years_in_current_job", 0),

            "credit_history_length": 6,
            "late_payments": 1,
            "total_payments": 24,
            "loan_amount": application["loan_amount"],
            "loan_tenure": application["loan_tenure"],

            # ONLY FROM DOCUMENT
            "account_balance": structured["account_balance"],
            "bank_balance_history": structured["bank_balance_history"]
        }

        print("\nFINAL ML INPUT:", ml_input)

        # ---------- ML ----------
        credit = get_credit_score(ml_input)
        fraud = get_fraud_score(ml_input)

        employment_verified = verify_employment(employment)

        decision = make_decision(
            credit["pd_score"],
            fraud["fraud_probability"],
            employment_verified
        ).upper()

        # ---------- FINAL STATUS ----------
        if decision == "ESCALATE":
            update_application_status(
                application_id,
                "ESCALATED",
                "Manual review required"
            )
            escalate_application(application_id)

        elif decision == "APPROVED":
            update_application_status(application_id, "APPROVED", None)

        else:
            update_application_status(
                application_id,
                "REJECTED",
                "High risk"
            )

        # ---------- SAVE ----------
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