from database.db import get_connection

def escalate_application(application_id):

    conn = get_connection()
    cur = conn.cursor()

    cur.execute(
        """
        UPDATE applications
        SET status='ESCALATED'
        WHERE application_id=%s
        """,
        (application_id,)
    )

    conn.commit()
    conn.close()