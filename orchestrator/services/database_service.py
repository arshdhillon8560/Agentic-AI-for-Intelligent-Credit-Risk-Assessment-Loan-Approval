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


def update_application_status(application_id, status, reason=None):

    cur = conn.cursor()

    cur.execute(
        """
        UPDATE applications
        SET status=%s,
            reason=%s,
            updated_at=NOW()
        WHERE application_id=%s
        """,
        (status, reason, application_id)
    )

    conn.commit()