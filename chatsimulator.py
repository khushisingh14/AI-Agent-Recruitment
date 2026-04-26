import random

def simulate_interest(candidate, jd):
    base = 0

    # --- 1. Status signal ---
    if candidate.get("status") == "Open to Work":
        base += 40
    else:
        base += 20

    # --- 2. Match score signal ---
    match_score = candidate.get("match_score", 0)

    if match_score > 80:
        base += 30
    elif match_score > 60:
        base += 20
    else:
        base += 10

    # --- 3. Skill alignment ---
    matched = len(candidate.get("matched_skills", []))

    if matched >= 2:
        base += 20
    elif matched == 1:
        base += 10

    # --- 4. Add slight randomness ---
    noise = random.randint(-5, 5)

    interest_score = min(max(base + noise, 0), 100)

    # --- Explanation ---
    reason = []

    if candidate.get("status") == "Open to Work":
        reason.append("Actively looking")
    else:
        reason.append("Passive candidate")

    if match_score > 70:
        reason.append("Strong skill alignment")

    return {
        "interest_score": interest_score,
        "reason": ", ".join(reason)
    }