"""
Supabase integration helpers for internVerse.
Falls back gracefully if credentials are not configured or offline.
"""

from __future__ import annotations

import os
from typing import TYPE_CHECKING, List, Optional

try:
    from dotenv import load_dotenv
    from supabase import Client, create_client
except ImportError:  # pragma: no cover - optional until pip install
    load_dotenv = None
    Client = object  # type: ignore[misc,assignment]
    create_client = None

if TYPE_CHECKING:
    from internship_agent.database import Internship
    from internship_agent.profile import StudentProfile


def _is_placeholder(value: str | None) -> bool:
    return not value or "YOUR_" in value


def get_supabase_client() -> Optional["Client"]:
    """Return an initialized Supabase client, or None if not configured."""
    if load_dotenv is None or create_client is None:
        return None
    load_dotenv()
    url = os.getenv("SUPABASE_URL", "").strip()
    key = os.getenv("SUPABASE_KEY", "").strip()
    if _is_placeholder(url) or _is_placeholder(key):
        return None
    return create_client(url, key)


def fetch_internships() -> Optional[List["Internship"]]:
    """Fetch all internships from Supabase, returning None if unavailable."""
    client = get_supabase_client()
    if client is None:
        return None

    from internship_agent.database import Internship

    try:
        rows = client.table("internships").select("*").execute().data
    except Exception:
        return None

    if not rows:
        return None

    return [
        Internship(
            id=str(row["id"]),
            company=row["company"],
            title=row["title"],
            stream=row["stream"],
            eligible_streams=list(row.get("eligible_streams") or []),
            skills_required=list(row.get("skills_required") or []),
            skills_preferred=list(row.get("skills_preferred") or []),
            location=row["location"],
            is_remote=bool(row.get("is_remote", False)),
            duration_months=int(row.get("duration_months") or 0),
            min_cgpa=float(row.get("min_cgpa") or 0.0),
            stipend=row["stipend"],
            application_url=row["application_url"],
            description=row["description"],
            tags=list(row.get("tags") or []),
        )
        for row in rows
    ]


def save_student_profile(profile: "StudentProfile") -> bool:
    """Persist a student profile to Supabase. Returns True on success."""
    client = get_supabase_client()
    if client is None or not profile.email:
        return False

    payload = {
        "name": profile.name,
        "email": profile.email,
        "phone": profile.phone,
        "stream": profile.stream,
        "college": profile.college,
        "graduation_year": profile.graduation_year,
        "cgpa": profile.cgpa,
        "skills": profile.skills,
        "location_preference": profile.location_preference,
        "remote_ok": profile.remote_ok,
        "duration_preference": profile.duration_preference,
        "stipend_expectation": profile.stipend_expectation,
        "looking_for": profile.looking_for,
        "additional_notes": profile.additional_notes,
    }
    try:
        client.table("student_profiles").insert(payload).execute()
        return True
    except Exception:
        return False
