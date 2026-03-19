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


def save_agent_result(
    application_id,
    credit_score,
    fraud_score,
    employment_verified,
    decision
):

    cur = conn.cursor()

    cur.execute(
        """
        INSERT INTO agent_results
        (application_id,
         credit_pd_score,
         fraud_probability,
         employment_verified,
         final_decision)
        VALUES (%s,%s,%s,%s,%s)
        """,
        (
            application_id,
            credit_score,
            fraud_score,
            employment_verified,
            decision
        )
    )

    conn.commit()