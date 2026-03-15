def make_decision(pd_score,fraud_prob,employment_verified):

    if fraud_prob > 0.7:
        return "REJECTED"

    if pd_score > 0.6:
        return "REJECTED"

    if not employment_verified:
        return "ESCALATE"

    if 0.4 < pd_score <= 0.6:
        return "ESCALATE"

    return "APPROVED"