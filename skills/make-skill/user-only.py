#!/usr/bin/env python3
"""Make skills user-only for Claude and Codex. Safe to rerun, for example after a vendor update.

  user-only.py <skill-name>...
"""

import re
import sys
from pathlib import Path

SKILLS = Path.home() / ".agents/skills"


def frontmatter(text: str) -> tuple[str, str]:
    match = re.match(r"---\n(.*?)\n---\n", text, re.S)
    if not match:
        raise SystemExit("no frontmatter")
    return match.group(1), text[match.end():]


def description(head: str) -> str:
    match = re.search(r"^description:[ \t]*[|>]?-?[ \t]*\n?((?:.*\n?)*?)(?=^[A-Za-z_-]+:|\Z)", head, re.M)
    text = " ".join(match.group(1).split()).strip("\"'") if match else ""
    first = re.split(r"\. | — | \(", text)[0]
    return (first if len(first) <= 90 else first[:90].rsplit(" ", 1)[0]).rstrip(",;:")


def claude(skill: Path) -> str:
    path = skill / "SKILL.md"
    head, body = frontmatter(path.read_text())
    head = re.sub(r"^disable-model-invocation:.*\n?", "", head, flags=re.M).rstrip("\n")
    path.write_text(f"---\n{head}\ndisable-model-invocation: true\n---\n{body}")
    return head


def codex(skill: Path, head: str) -> None:
    path = skill / "agents/openai.yaml"
    if path.exists():
        text = re.sub(r"^policy:\n(?:[ \t]+.*\n?)*", "", path.read_text(), flags=re.M).rstrip("\n")
    else:
        name = skill.name
        summary = description(head).replace('"', "'")
        text = (
            "interface:\n"
            f'  display_name: "{name.replace("-", " ").title()}"\n'
            f'  short_description: "{summary}"\n'
            f'  default_prompt: "Use ${name}."'
        )
        path.parent.mkdir(exist_ok=True)
    path.write_text(text + "\npolicy:\n  allow_implicit_invocation: false\n")


for name in sys.argv[1:] or sys.exit(__doc__):
    skill = SKILLS / name
    if not (skill / "SKILL.md").is_file():
        raise SystemExit(f"{name}: no {skill}/SKILL.md")
    codex(skill, claude(skill))
    print(f"{name}: user-only")
