import re

from fastapi import HTTPException

from src.constants.constants import Constants


def create_username(lastname: str, firstname:str):
    lastname = (lastname or "").strip().lower()
    firstname = (firstname or "").strip().lower()

    if not lastname.strip() or not firstname.strip():
        raise HTTPException(
            status_code=400,
            detail="Please enter your lastname or firstname",
        )

    if len(lastname) >= Constants.MAX_TOTAL_LEN:
        return lastname[:(Constants.MAX_TOTAL_LEN -1)] + firstname[0]

    return lastname.strip() + firstname.strip()[0]


def update_username_with_suffix(username: str, existing_usernames: set):
    used_numbers = set()
    pattern = re.compile(r'^' + re.escape(username) + r'(\d+)$')
    for uname in existing_usernames:
        m = pattern.match(uname)
        if m:
            used_numbers.add(int(m.group(1)))
    used_numbers.add(0)

    counter = 1
    first_initial = username[-1]
    while True:
        if counter not in used_numbers:
            suffix = str(counter)
            if len(username) == Constants.MAX_TOTAL_LEN:
                username = username[:Constants.MAX_TOTAL_LEN - len(suffix) - 1] + first_initial + suffix
            else:
                username = username[:(len(username) - len(suffix))] + first_initial + suffix
            if username not in existing_usernames:
                return username
        counter += 1

