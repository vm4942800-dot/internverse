"""
Matching engine: scores each internship against a student profile and ranks them.

Scoring factors (weighted):
  1. Stream eligibility       — 30%
  2. Skills match              — 30%
  3. CGPA eligibility          — 15%
  4. Location / remote fit     — 15%
  5. Duration / stipend fit    — 10%
"""

from dataclasses import dataclass
from typing import List, Tuple

from internship_agent.database import Internship, get_all_internships
from internship_agent.profile import StudentProfile


@dataclass
class MatchResult:
    internship: Internship
    score: float            # 0.0 – 100.0
    reasons: List[str]      # human-readable explanation
    warnings: List[str]     # potential concerns


# ── Weights ──────────────────────────────────────────────────────────────────

W_STREAM = 30
W_SKILLS = 30
W_CGPA   = 15
W_LOCATION = 15
W_COMFORT = 10


# ── Helpers ──────────────────────────────────────────────────────────────────

def _normalize(skills: List[str]) -> set:
    return {s.strip().lower() for s in skills}


def _stream_score(internship: Internship, profile: StudentProfile) -> Tuple[float, List[str], List[str]]:
    reasons, warnings = [], []
    stream_lower = profile.stream.lower()

    # Check if student's stream is in the eligible list
    eligible_lower = [s.lower() for s in internship.eligible_streams]
    if stream_lower in eligible_lower:
        # Direct match
        reasons.append(f"Your stream ({profile.stream}) is a match")
        return 100.0, reasons, warnings

    # Partial match: check overlap in keywords
    student_words = set(stream_lower.replace("/", " ").replace("&", " ").split())
    for eligible in eligible_lower:
        eligible_words = set(eligible.replace("/", " ").replace("&", " ").split())
        if student_words & eligible_words:
            reasons.append(f"Partial stream match with '{eligible}'")
            return 60.0, reasons, warnings

    warnings.append(f"Stream '{profile.stream}' is not listed as eligible")
    return 0.0, reasons, warnings


def _skills_score(internship: Internship, profile: StudentProfile) -> Tuple[float, List[str], List[str]]:
    reasons, warnings = [], []
    student_skills = _normalize(profile.skills)
    required = _normalize(internship.skills_required)
    preferred = _normalize(internship.skills_preferred)

    if not required and not preferred:
        return 80.0, ["No specific skills required"], warnings

    matched_required = student_skills & required
    matched_preferred = student_skills & preferred

    # Required skills score (up to 70 points)
    if required:
        req_pct = len(matched_required) / len(required) * 70
    else:
        req_pct = 70

    # Preferred skills score (up to 30 points)
    if preferred:
        pref_pct = len(matched_preferred) / len(preferred) * 30
    else:
        pref_pct = 30

    total = req_pct + pref_pct

    if matched_required:
        reasons.append(f"Matches required skills: {', '.join(sorted(matched_required))}")
    if matched_preferred:
        reasons.append(f"Matches preferred skills: {', '.join(sorted(matched_preferred))}")

    missing_required = required - student_skills
    if missing_required:
        warnings.append(f"Missing required skills: {', '.join(sorted(missing_required))}")

    return min(total, 100.0), reasons, warnings


def _cgpa_score(internship: Internship, profile: StudentProfile) -> Tuple[float, List[str], List[str]]:
    reasons, warnings = [], []
    if profile.cgpa <= 0:
        reasons.append("CGPA not provided")
        return 60.0, reasons, warnings  # neutral

    if profile.cgpa >= internship.min_cgpa:
        margin = profile.cgpa - internship.min_cgpa
        if margin >= 1.0:
            reasons.append(f"CGPA ({profile.cgpa}) well above requirement ({internship.min_cgpa})")
        else:
            reasons.append(f"CGPA ({profile.cgpa}) meets requirement ({internship.min_cgpa})")
        return 100.0, reasons, warnings
    else:
        gap = internship.min_cgpa - profile.cgpa
        warnings.append(f"CGPA ({profile.cgpa}) below minimum ({internship.min_cgpa})")
        # Partial credit: give some score proportional to how close
        score = max(0, (1 - gap / 3.0)) * 40  # up to 40 points
        return score, reasons, warnings


def _location_score(internship: Internship, profile: StudentProfile) -> Tuple[float, List[str], List[str]]:
    reasons, warnings = [], []

    if internship.is_remote and profile.remote_ok:
        reasons.append("Remote-friendly — matches your preference")
        return 100.0, reasons, warnings

    pref = profile.location_preference.lower()
    if pref in ("any", ""):
        reasons.append("No location preference — any location works")
        return 100.0, reasons, warnings

    loc = internship.location.lower()
    if pref in loc or loc in pref or pref == "remote" and internship.is_remote:
        reasons.append(f"Location match: {internship.location}")
        return 100.0, reasons, warnings

    if "multiple" in loc:
        reasons.append("Multiple locations available")
        return 70.0, reasons, warnings

    if internship.is_remote and not profile.remote_ok:
        warnings.append("This is a remote internship but you prefer on-site")
    else:
        warnings.append(f"Location mismatch: you prefer '{profile.location_preference}' but this is in '{internship.location}'")

    return 20.0, reasons, warnings


def _comfort_score(internship: Internship, profile: StudentProfile) -> Tuple[float, List[str], List[str]]:
    reasons, warnings = [], []
    score = 80.0  # default

    # Duration
    if profile.duration_preference > 0:
        diff = abs(internship.duration_months - profile.duration_preference)
        if diff == 0:
            reasons.append(f"Duration matches your preference ({internship.duration_months} months)")
            score += 10
        elif diff <= 1:
            reasons.append(f"Duration close to preference ({internship.duration_months} vs {profile.duration_preference} months)")
            score += 5
        else:
            warnings.append(f"Duration is {internship.duration_months} months (you preferred {profile.duration_preference})")

    return min(score, 100.0), reasons, warnings


# ── Main scorer ──────────────────────────────────────────────────────────────

def score_internship(internship: Internship, profile: StudentProfile) -> MatchResult:
    all_reasons = []
    all_warnings = []

    s1, r1, w1 = _stream_score(internship, profile)
    all_reasons.extend(r1); all_warnings.extend(w1)

    s2, r2, w2 = _skills_score(internship, profile)
    all_reasons.extend(r2); all_warnings.extend(w2)

    s3, r3, w3 = _cgpa_score(internship, profile)
    all_reasons.extend(r3); all_warnings.extend(w3)

    s4, r4, w4 = _location_score(internship, profile)
    all_reasons.extend(r4); all_warnings.extend(w4)

    s5, r5, w5 = _comfort_score(internship, profile)
    all_reasons.extend(r5); all_warnings.extend(w5)

    weighted = (
        s1 * W_STREAM / 100
        + s2 * W_SKILLS / 100
        + s3 * W_CGPA / 100
        + s4 * W_LOCATION / 100
        + s5 * W_COMFORT / 100
    ) * 100 / (W_STREAM + W_SKILLS + W_CGPA + W_LOCATION + W_COMFORT)

    return MatchResult(
        internship=internship,
        score=round(weighted, 1),
        reasons=all_reasons,
        warnings=all_warnings,
    )


def find_matches(profile: StudentProfile, top_n: int = 10) -> List[MatchResult]:
    """Score every internship and return the top N sorted by score descending."""
    results = [score_internship(i, profile) for i in get_all_internships()]
    results.sort(key=lambda r: r.score, reverse=True)
    return results[:top_n]
