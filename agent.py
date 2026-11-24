"""
Main agent: conversational CLI that collects a student profile,
finds matching internships, and presents results with rich formatting.
"""

from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.columns import Columns
from rich.text import Text
from rich.prompt import Prompt, Confirm
from rich import box

from internship_agent.profile import collect_profile, StudentProfile
from internship_agent.matcher import find_matches, MatchResult
from internship_agent.supabase_client import save_student_profile


console = Console()


# ── Display helpers ──────────────────────────────────────────────────────────

def _score_bar(score: float) -> Text:
    """Colored score with a visual bar."""
    filled = int(score / 5)
    bar = "█" * filled + "░" * (20 - filled)
    if score >= 75:
        color = "green"
        label = "Great"
    elif score >= 50:
        color = "yellow"
        label = "Good"
    elif score >= 30:
        color = "dark_orange"
        label = "Fair"
    else:
        color = "red"
        label = "Low"

    t = Text()
    t.append(f"{bar} ", style=f"bold {color}")
    t.append(f"{score}/100 ", style=f"bold {color}")
    t.append(f"({label})", style=color)
    return t


def display_results(matches: list[MatchResult]):
    """Show a ranked table of internship matches."""
    console.print()
    console.print(Panel(
        f"[bold]🎯 Top {len(matches)} Internship Matches[/bold]\n"
        "[dim]Scored based on your stream, skills, CGPA, and preferences[/dim]",
        border_style="bright_blue",
        box=box.DOUBLE,
    ))

    # ── Table view ──
    table = Table(box=box.ROUNDED, show_lines=True, expand=True)
    table.add_column("#", style="bold cyan", width=3)
    table.add_column("Company", style="bold white", min_width=14)
    table.add_column("Role", min_width=20)
    table.add_column("Location", min_width=12)
    table.add_column("Duration", width=10, justify="center")
    table.add_column("Stipend", width=14, justify="right")
    table.add_column("Match", min_width=30)

    for idx, m in enumerate(matches, 1):
        i = m.internship
        remote_tag = " 🌐" if i.is_remote else ""
        table.add_row(
            str(idx),
            i.company,
            i.title,
            i.location + remote_tag,
            f"{i.duration_months}mo",
            i.stipend,
            _score_bar(m.score),
        )

    console.print(table)

    # ── Detail view ──
    console.print("\n[bold]📝 Detailed Breakdown[/bold]\n")
    for idx, m in enumerate(matches, 1):
        i = m.internship
        header = f"[bold cyan]#{idx}[/bold cyan] [bold]{i.company}[/bold] — {i.title}"

        detail_lines = [f"[dim]{i.description}[/dim]", ""]
        detail_lines.append(f"  📍 {i.location}  |  ⏱ {i.duration_months} months  |  💰 {i.stipend}")
        detail_lines.append(f"  🔗 {i.application_url}")
        detail_lines.append("")

        if m.reasons:
            detail_lines.append("  [green]✅ Why this matches:[/green]")
            for r in m.reasons:
                detail_lines.append(f"     • {r}")

        if m.warnings:
            detail_lines.append("  [yellow]⚠️  Things to note:[/yellow]")
            for w in m.warnings:
                detail_lines.append(f"     • {w}")

        detail_lines.append(f"  [bold]Skills required:[/bold] {', '.join(i.skills_required)}")
        if i.skills_preferred:
            detail_lines.append(f"  [dim]Skills preferred:[/dim] {', '.join(i.skills_preferred)}")
        detail_lines.append(f"  [dim]Min CGPA: {i.min_cgpa} | Eligible streams: {', '.join(i.eligible_streams)}[/dim]")

        console.print(Panel(
            "\n".join(detail_lines),
            title=header,
            border_style="cyan" if m.score >= 70 else ("yellow" if m.score >= 40 else "dim"),
            padding=(1, 2),
        ))


def display_quick_tips(matches: list[MatchResult]):
    """Show actionable tips based on match results."""
    if not matches:
        return

    console.print()
    console.print(Panel(
        "[bold]💡 Quick Tips to Improve Your Chances[/bold]",
        border_style="bright_magenta",
    ))

    # Collect all missing skills
    all_missing = set()
    for m in matches:
        for w in m.warnings:
            if "Missing required skills" in w:
                skills_part = w.split(": ", 1)[1] if ": " in w else ""
                for s in skills_part.split(", "):
                    all_missing.add(s.strip())

    if all_missing:
        console.print(f"  [yellow]📌 Consider learning these high-demand skills:[/yellow]")
        for s in sorted(all_missing):
            console.print(f"     • {s}")

    low_cgpa = any(
        "below minimum" in w
        for m in matches for w in m.warnings
    )
    if low_cgpa:
        console.print("  [yellow]📌 Your CGPA is below some requirements — focus on strong skills & projects to compensate.[/yellow]")

    console.print("  [green]📌 Apply to at least 10-15 internships for the best chances.[/green]")
    console.print("  [green]📌 Customize your resume for each application — highlight relevant skills.[/green]")
    console.print()


# ── Main loop ────────────────────────────────────────────────────────────────

def run_agent():
    """Entry point: collect profile, find matches, display results."""
    console.print(Panel(
        "[bold bright_white]🎓 internVerse[/bold bright_white]\n"
        "[dim]  Smart internship matching for ALL streams[/dim]\n\n"
        "I'll collect your basic info and find the best internship\n"
        "matches from top companies across India.\n\n"
        "[bold]Supported streams:[/bold] CS/IT • Electronics • Mechanical • Civil\n"
        "Commerce • Finance • BBA • Arts • Design • Data Science\n"
        "Pharmacy • Biotechnology • Mass Comm & more...",
        border_style="bright_blue",
        box=box.DOUBLE,
        padding=(1, 2),
    ))

    profile = collect_profile()
    save_student_profile(profile)

    console.print("\n[bold cyan]🔍 Searching for the best matches...[/bold cyan]\n")

    matches = find_matches(profile, top_n=8)

    if not matches:
        console.print("[red]No matching internships found. Try broadening your skills or location preferences.[/red]")
        return

    display_results(matches)
    display_quick_tips(matches)

    # ── Follow-up actions ──
    console.print("[bold]What would you like to do?[/bold]")
    console.print("  1. [green]Export results to a text file[/green]")
    console.print("  2. [yellow]Update my profile and re-search[/yellow]")
    console.print("  3. [dim]Exit[/dim]")

    choice = Prompt.ask("\nYour choice", default="3", choices=["1", "2", "3"])

    if choice == "1":
        export_results(profile, matches)
    elif choice == "2":
        run_agent()  # restart


def export_results(profile: StudentProfile, matches: list[MatchResult]):
    """Save results to a text file."""
    filename = f"internship_matches_{profile.name.replace(' ', '_').lower()}.txt"
    lines = [
        "=" * 70,
        f"INTERNSHIP MATCHES FOR {profile.name.upper()}",
        f"Stream: {profile.stream} | CGPA: {profile.cgpa} | Skills: {', '.join(profile.skills)}",
        "=" * 70,
        "",
    ]

    for idx, m in enumerate(matches, 1):
        i = m.internship
        lines.append(f"#{idx}  {i.company} — {i.title}  (Score: {m.score}/100)")
        lines.append(f"    {i.description}")
        lines.append(f"    📍 {i.location}  |  ⏱ {i.duration_months} months  |  💰 {i.stipend}")
        lines.append(f"    🔗 {i.application_url}")
        lines.append(f"    Required: {', '.join(i.skills_required)}")
        if i.skills_preferred:
            lines.append(f"    Preferred: {', '.join(i.skills_preferred)}")
        lines.append(f"    Match reasons: {'; '.join(m.reasons)}")
        if m.warnings:
            lines.append(f"    Warnings: {'; '.join(m.warnings)}")
        lines.append("")

    with open(filename, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    console.print(f"\n[green]✅ Results exported to [bold]{filename}[/bold][/green]")
