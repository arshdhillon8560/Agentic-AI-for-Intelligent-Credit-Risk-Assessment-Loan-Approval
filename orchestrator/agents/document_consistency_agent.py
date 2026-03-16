import re


def normalize_name(name):

    if not name:
        return ""

    name = str(name).lower()

    # remove special characters
    name = re.sub(r'[^a-z\s]', '', name)

    # remove extra spaces
    name = " ".join(name.split())

    return name


def check_document_consistency(profile, financial, parsed):

    profile_name = normalize_name(profile.get("name"))

    bank_holder = normalize_name(parsed.get("bank_account_holder"))
    salary_name = normalize_name(parsed.get("salary_name"))
    itr_name = normalize_name(parsed.get("itr_name"))

    pan_db = profile.get("pan_number")
    pan_itr = parsed.get("itr_pan")

    account_db = financial.get("bank_account_number")
    account_doc = parsed.get("account_number")

    # ---------- NAME MATCH ----------
    if profile_name and bank_holder and profile_name not in bank_holder:
        return False, "Bank statement name mismatch"

    if profile_name and salary_name:
        if len(salary_name.split()) < 2:
            return False, "Invalid salary slip name"

        if profile_name not in salary_name:
            return False, "Salary slip name mismatch"

    if profile_name and itr_name and profile_name not in itr_name:
        return False, "ITR name mismatch"

    # ---------- PAN MATCH ----------
    if pan_db and pan_itr and pan_db != pan_itr:
        return False, "PAN mismatch in ITR"

    # ---------- ACCOUNT NUMBER ----------
    if account_db and account_doc and account_db != account_doc:
        return False, "Bank account number mismatch"

    return True, "Documents verified"