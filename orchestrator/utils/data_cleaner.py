def clean_numeric(value, default=0):

    try:
        return float(value)
    except:
        return default


def clean_balance_history(history):

    cleaned = []

    if not isinstance(history, list):
        return [50000, 52000]

    for item in history:

        try:

            if isinstance(item, dict):
                val = item.get("balance") or item.get("amount")
                cleaned.append(float(val))

            else:
                cleaned.append(float(item))

        except:
            continue

    if len(cleaned) == 0:
        cleaned = [50000, 52000]

    return cleaned