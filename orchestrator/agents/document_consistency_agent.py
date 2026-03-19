import re


def normalize(name):

    if not name:
        return ""

    if not isinstance(name, str):  # 🔥 fix crash
        name = str(name)

    name = name.lower()
    name = re.sub(r'[^a-z\s]', '', name)
    name = " ".join(name.split())

    return name


def check_document_consistency(profile, financial, parsed):

    profile_name = normalize(profile.get("name"))

    bank_name = normalize(parsed.get("bank_account_holder"))
    salary_name = normalize(parsed.get("salary_person_name"))
    itr_name = normalize(parsed.get("itr_name"))

    pan_db = profile.get("pan_number")
    pan_itr = parsed.get("itr_pan")

    account_db = financial.get("bank_account_number")
    account_doc = parsed.get("account_number")

    # ---------- NAME CHECK ----------
    if profile_name and bank_name and profile_name not in bank_name:
        return False, "Name mismatch in bank statement"

    # 🔥 FIXED salary check (no false rejection)
    if salary_name and len(salary_name.split()) > 1:
        if profile_name not in salary_name:
            return False, "Name mismatch in salary slip"

    if profile_name and itr_name and profile_name not in itr_name:
        return False, "Name mismatch in ITR document"

    # ---------- PAN ----------
    if pan_db and pan_itr and pan_db != pan_itr:
        return False, "PAN mismatch in ITR document"

    # ---------- ACCOUNT ----------
    if account_db and account_doc and account_db != account_doc:
        return False, "Bank account number mismatch"

    return True, None