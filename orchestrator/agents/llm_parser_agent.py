import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def parse_document(text):

    prompt = f"""
Extract structured data STRICTLY in JSON.

DO NOT GUESS.
If value missing → return null.

Fields:
- bank_account_holder
- account_number
- salary_person_name
- itr_name
- itr_pan
- monthly_income
- bank_balance_history
- account_balance

Return ONLY valid JSON.

TEXT:
{text}
"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )

    content = completion.choices[0].message.content

    content = content.replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(content)
    except:
        print("LLM PARSE ERROR:", content)
        return {}