import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

conn = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
    database=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD")
)

def get_application_data(application_id):

    cur = conn.cursor()

    cur.execute("SELECT * FROM applications WHERE application_id=%s",(application_id,))
    application = cur.fetchone()

    cur.execute("SELECT * FROM applicant_profiles WHERE application_id=%s",(application_id,))
    profile = cur.fetchone()

    cur.execute("SELECT * FROM employment_details WHERE application_id=%s",(application_id,))
    employment = cur.fetchone()

    cur.execute("SELECT * FROM financial_details WHERE application_id=%s",(application_id,))
    financial = cur.fetchone()

    cur.execute("SELECT * FROM documents WHERE application_id=%s",(application_id,))
    documents = cur.fetchone()

    return {

        "application":{
            "loan_amount":application[3],
            "loan_tenure":application[4],
            "loan_purpose":application[5]
        },

        "profile":{
            "age":profile[2],
            "dob":profile[3],
            "pan":profile[6],
            "aadhaar":profile[7]
        },

        "employment":{
            "employment_type":employment[2],
            "employer_name":employment[3],
            "industry":employment[4],
            "job_title":employment[5],
            "years_in_job":employment[6],
            "total_experience":employment[7],
            "monthly_income":employment[8]
        },

        "financial":{
            "existing_loans":financial[2],
            "existing_emi":financial[3],
            "credit_card_limit":financial[4],
            "credit_card_balance":financial[5],
            "bank_balance":financial[8]
        },

        "documents":{
            "bank_statement_url":documents[2],
            "salary_slip_url":documents[3],
            "itr_document_url":documents[4]
        }

    }