def verify_employment(employment_data):

    # safely get years of employment
    years = employment_data.get("years_in_current_job") or employment_data.get("years_in_job", 0)

    if years >= 1:
        return True

    return False