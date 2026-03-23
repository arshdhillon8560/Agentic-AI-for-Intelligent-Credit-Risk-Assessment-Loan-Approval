import re
import numpy as np


def extract_financial_features(text):

    clean_text = text.replace(",", "")

    # ---------- SALARY ----------
    salary_matches = re.findall(
        r"Salary\s*Credit\s*\n?\s*(\d+)",
        clean_text,
        re.IGNORECASE
    )

    if not salary_matches:
        salary_matches = re.findall(
            r"Gross\s*Salary\s*(\d+)",
            clean_text,
            re.IGNORECASE
        )

    if not salary_matches:
        raise Exception("Salary not found in documents")

    monthly_income = max([int(x) for x in salary_matches])

    print("EXTRACTED SALARY:", monthly_income)

    # ---------- BALANCES ----------
    balances = re.findall(r"\n(\d{4,6})\n", clean_text)
    balances = [int(x) for x in balances]

    if not balances:
        raise Exception("Balance data not found")

    avg_balance = int(np.mean(balances))

    return {
        "monthly_income": monthly_income,
        "account_balance": balances[-1],
        "bank_balance_history": balances,
        "avg_balance": avg_balance,
        "min_balance": min(balances),
        "max_balance": max(balances),
        "income_stability": round(
            1 - (np.std(balances) / np.mean(balances)), 2
        )
    }