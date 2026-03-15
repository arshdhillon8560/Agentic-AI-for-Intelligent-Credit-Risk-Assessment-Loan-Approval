import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def parse_document(text):

    prompt = f"""
You are a financial document parser.

From the bank statement text below extract financial features.

Return ONLY valid JSON.

Fields required:
age
monthly_income
existing_emi
credit_card_balance
credit_card_limit
number_of_existing_loans
years_in_job
credit_history_length
late_payments
total_payments
account_balance
bank_balance_history

Bank Statement Text:
{text}
"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role":"user","content":prompt}
        ]
    )

    content = completion.choices[0].message.content

    content = content.replace("```json","").replace("```","").strip()

    return json.loads(content)