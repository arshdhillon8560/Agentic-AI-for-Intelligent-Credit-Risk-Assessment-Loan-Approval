import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def parse_document(text):

    prompt = f"""
You are a financial document parser.

The document text may contain a bank statement, salary slip, or ITR.

Extract the following fields.

IMPORTANT RULES:

1. salary_name must be the employee name from the salary slip
2. It should be a PERSON NAME (example: Arshdeep Singh)
3. DO NOT return words like:
   Salary Credit
   Transaction
   Withdrawal
   Deposit
4. bank_account_holder must be the name in bank statement
5. itr_name must be the taxpayer name
6. itr_pan must be the PAN number from ITR

Return ONLY JSON.

Fields:

bank_account_holder
account_number
salary_name
itr_name
itr_pan
monthly_income
bank_balance_history
account_balance

Document Text:
{text}
"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    content = completion.choices[0].message.content

    content = content.replace("```json", "").replace("```", "").strip()

    return json.loads(content)