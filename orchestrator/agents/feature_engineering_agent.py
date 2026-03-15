import re
import numpy as np


def extract_financial_features(text):

    # find salary credits
    salary_matches = re.findall(r"Salary\s+Credit\s+(\d+)", text)

    salaries = [int(x) for x in salary_matches]

    monthly_income = max(salaries) if salaries else 50000

    # find withdrawals
    withdrawal_matches = re.findall(r"Withdrawal\s+(\d+)", text)

    withdrawals = [int(x) for x in withdrawal_matches]

    total_withdrawals = sum(withdrawals) if withdrawals else 0

    # find balances
    balance_matches = re.findall(r"Balance\s+(\d+)", text)

    balances = [int(x) for x in balance_matches]

    if balances:
        avg_balance = int(np.mean(balances))
        min_balance = min(balances)
        max_balance = max(balances)
    else:
        avg_balance = 50000
        min_balance = 50000
        max_balance = 50000

    # income stability
    if balances:
        stability = 1 - (np.std(balances) / np.mean(balances))
        stability = max(0, min(1, stability))
    else:
        stability = 0.5

    return {
        "monthly_income": monthly_income,
        "total_withdrawals": total_withdrawals,
        "avg_balance": avg_balance,
        "min_balance": min_balance,
        "max_balance": max_balance,
        "account_balance": balances[-1] if balances else 50000,
        "income_stability": round(stability, 2)
    }