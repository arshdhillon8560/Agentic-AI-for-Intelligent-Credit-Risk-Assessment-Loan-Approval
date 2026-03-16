CRITICAL_FIELDS = [
    "monthly_income",
    "bank_balance_history",
    "account_balance"
]


def validate_document_data(data):

    # ensure required fields exist
    for field in CRITICAL_FIELDS:

        if field not in data:
            return {
                "valid": False,
                "reason": f"Missing required field: {field}"
            }

    # monthly income must be numeric
    try:
        income = float(data["monthly_income"])

        if income <= 0:
            return {
                "valid": False,
                "reason": "Monthly income must be positive"
            }

    except:
        return {
            "valid": False,
            "reason": "Monthly income not numeric"
        }

    # bank balance history must be a list
    if not isinstance(data["bank_balance_history"], list):
        return {
            "valid": False,
            "reason": "Invalid bank balance history format"
        }

    if len(data["bank_balance_history"]) == 0:
        return {
            "valid": False,
            "reason": "Empty bank balance history"
        }

    return {"valid": True}