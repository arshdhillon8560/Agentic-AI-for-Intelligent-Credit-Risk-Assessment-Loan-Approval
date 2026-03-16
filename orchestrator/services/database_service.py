import psycopg2
import os

conn = psycopg2.connect(
    host=os.getenv("DB_HOST"),
    database=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    port=os.getenv("DB_PORT")
)

def update_application_status(application_id, decision):

    cur = conn.cursor()

    cur.execute(
        """
        UPDATE applications
        SET status=%s
        WHERE application_id=%s
        """,
        (decision, application_id)
    )

    conn.commit()

    cur.close()