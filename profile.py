"""
Student profile: data model + conversational collector.
Only asks for information the student hasn't provided yet.
"""

from dataclasses import dataclass, field
from typing import List, Optional
import re

from rich.console import Console
from rich.prompt import Prompt, Confirm

console = Console()

# All supported streams
STREAMS = [
    "CS/IT",
    "Electronics",
    "Electrical",
    "Mechanical",
    "Civil",
    "Commerce",
    "Finance",
    "BBA",
    "Arts",
    "Design",
    "Data Science",
    "Mathematics",
    "Statistics",
    "Economics",
    "Pharmacy",
    "Biotechnology",
    "Chemistry",
    "Mass Communication",
    "Journalism",
    "English",
    "Automobile",
    "Industrial",
    "Production",
    "Construction",
    "Transportation",
    "Urban Planning",
    "Psychology",
    "MBA",
    "Marketing",
]

# Common skills grouped by stream
SKILL_SUGGESTIONS = {
    "CS/IT": ["Python", "Java", "C++", "JavaScript", "SQL", "Data Structures", "React", "Node.js", "Git", "AWS"],
    "Electronics": ["VLSI", "Verilog", "Embedded C", "MATLAB", "PCB Design", "Signal Processing"],
    "Mechanical": ["AutoCAD", "SolidWorks", "CATIA", "MATLAB", "ANSYS", "CNC", "Manufacturing"],
    "Civil": ["AutoCAD", "STAAD Pro", "Revit", "Structural Analysis", "GIS", "Project Management"],
    "Commerce": ["Accounting", "Tally", "SAP", "Financial Analysis", "MS Excel", "GST"],
    "Design": ["Figma", "Adobe XD", "Illustrator", "Photoshop", "UI Design", "Prototyping"],
    "Data Science": ["Python", "Machine Learning", "SQL", "Tableau", "TensorFlow", "Statistics"],
    "default": ["MS Excel", "Communication", "Problem Solving", "Teamwork"],
}


@dataclass
class StudentProfile:
    name: str = ""
    email: str = ""
    phone: str = ""
    stream: str = ""
    college: str = ""
    graduation_year: int = 0
    cgpa: float = 0.0
    skills: List[str] = field(default_factory=list)
    location_preference: str = ""
    remote_ok: bool = True
    duration_preference: int = 0          # 0 = no preference
    stipend_expectation: int = 0          # ₹/month, 0 = no preference
    looking_for: str = ""                 # e.g. "technical", "finance", "creative"
    additional_notes: str = ""

    def is_complete(self) -> bool:
        return bool(self.name and self.stream and self.skills)


def _clean(text: str) -> str:
    return text.strip().strip('"').strip("'")


def _valid_email(email: str) -> bool:
    return bool(re.match(r"^[\w.+-]+@[\w-]+\.[\w.]+$", email))


def _ask(prompt_text: str, default: str = "", validate=None) -> str:
    while True:
        val = _clean(Prompt.ask(f"  {prompt_text}", default=default))
        if not val and default:
            val = default
        if validate and val and not validate(val):
            console.print(f"    [red]Invalid input. Please try again.[/red]")
            continue
        return val


def _ask_int(prompt_text: str, default: int = 0) -> int:
    while True:
        val = _ask(prompt_text, default=str(default) if default else "")
        try:
            return int(val) if val else default
        except ValueError:
            console.print("    [red]Please enter a number.[/red]")


def _ask_float(prompt_text: str, default: float = 0.0) -> float:
    while True:
        val = _ask(prompt_text, default=str(default) if default else "")
        try:
            return float(val) if val else default
        except ValueError:
            console.print("    [red]Please enter a number.[/red]")


def _pick_skills(stream: str) -> List[str]:
    """Suggest skills based on stream and let student pick + add custom ones."""
    suggestions = SKILL_SUGGESTIONS.get(stream, SKILL_SUGGESTIONS["default"])
    console.print(f"\n  [cyan]Suggested skills for {stream}:[/cyan]")
    for idx, skill in enumerate(suggestions, 1):
        console.print(f"    {idx}. {skill}")

    raw = _ask(
        f"Pick skills by number (comma-separated) or type your own (comma-separated):",
        default="1,2,3",
    )

    picked = []
    for part in raw.split(","):
        part = part.strip()
        if part.isdigit():
            num = int(part) - 1
            if 0 <= num < len(suggestions):
                picked.append(suggestions[num])
        elif part:
            picked.append(part)
    return list(dict.fromkeys(picked))  # deduplicate, preserve order


def collect_profile() -> StudentProfile:
    """Interactively collect a student profile."""
    console.print("\n[bold green]━━━ Internship Finder Agent ━━━[/bold green]")
    console.print("[dim]I'll ask a few questions to find the best internships for you.[/dim]\n")

    profile = StudentProfile()

    # ── Basic Info ──
    console.print("[bold]📋 Basic Information[/bold]")
    profile.name = _ask("Your full name", validate=lambda x: len(x) >= 2)
    profile.email = _ask("Email address", validate=_valid_email)
    profile.phone = _ask("Phone number", default="")

    # ── Education ──
    console.print("\n[bold]🎓 Education[/bold]")
    # Show stream list
    console.print("  Available streams:")
    for idx, s in enumerate(STREAMS, 1):
        console.print(f"    {idx:2d}. {s}")
    raw_stream = _ask("Your stream (number or type name)")
    if raw_stream.isdigit():
        num = int(raw_stream) - 1
        if 0 <= num < len(STREAMS):
            profile.stream = STREAMS[num]
    if not profile.stream:
        profile.stream = _clean(raw_stream)
    console.print(f"    → [green]{profile.stream}[/green]")

    profile.college = _ask("College / University name", default="Not specified")
    profile.graduation_year = _ask_int("Expected graduation year (e.g. 2026)", default=2026)
    profile.cgpa = _ask_float("Current CGPA / percentage (out of 10 or 100)", default=0.0)
    if profile.cgpa > 10:
        profile.cgpa = profile.cgpa / 10  # auto-convert 100-scale to 10-scale

    # ── Skills ──
    console.print("\n[bold]🛠️  Skills[/bold]")
    profile.skills = _pick_skills(profile.stream)

    # ── Preferences ──
    console.print("\n[bold]🎯 Preferences[/bold]")
    profile.location_preference = _ask(
        "Preferred location (or 'Any' / 'Remote')", default="Any"
    )
    profile.remote_ok = Confirm.ask("  Open to remote internships?", default=True)
    profile.duration_preference = _ask_int(
        "Preferred duration in months (0 = no preference)", default=0
    )
    profile.stipend_expectation = _ask_int(
        "Minimum expected stipend ₹/month (0 = no preference)", default=0
    )
    profile.additional_notes = _ask("Anything else you'd like me to know?", default="")

    # ── Summary ──
    console.print("\n[bold green]✅ Profile Complete![/bold green]")
    console.print(f"  Name:     {profile.name}")
    console.print(f"  Stream:   {profile.stream}")
    console.print(f"  Skills:   {', '.join(profile.skills)}")
    console.print(f"  CGPA:     {profile.cgpa}")
    console.print(f"  Location: {profile.location_preference}")
    console.print(f"  Remote:   {'Yes' if profile.remote_ok else 'No'}")
    console.print()

    return profile
