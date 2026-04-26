def match_candidates(jd, candidates):
    results = []

    jd_skills = [s.lower() for s in jd.get("skills_required", [])]
    jd_domain = jd.get("domain", "").lower()
    jd_exp = int(jd.get("experience", 0))

    for c in candidates:
        cand_skills = [s.lower() for s in c.get("skills", [])]

        # --- Skill Matching ---
        matched = list(set(jd_skills) & set(cand_skills))
        missing = list(set(jd_skills) - set(cand_skills))

        skill_score = len(matched) / len(jd_skills) if jd_skills else 0

        # --- Experience Matching ---
        cand_exp = c.get("experience", 0)

        if cand_exp >= jd_exp:
            exp_score = 1.0
        elif cand_exp >= jd_exp - 1:
            exp_score = 0.7
        else:
            exp_score = 0.4

        # --- Domain Matching ---
        cand_domain = c.get("domain", "").lower()
        domain_score = 1 if jd_domain == cand_domain else 0

        # --- Final Score ---
        match_score = (0.5*skill_score + 0.3*exp_score + 0.2*domain_score) * 100

        # --- Create new object (DON’T modify original) ---
        result = {
            "name": c.get("name"),
            "skills": c.get("skills"),
            "experience": cand_exp,
            "domain": c.get("domain"),
            "match_score": round(match_score, 2),
            "matched_skills": matched,
            "missing_skills": missing,
            "explanation": {
                "skill_score": round(skill_score, 2),
                "experience_score": exp_score,
                "domain_score": domain_score
            }
        }

        results.append(result)

    return results