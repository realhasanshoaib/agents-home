#!/usr/bin/env python3
"""Compare the shared agent setup on the MacBook Air with the other machines, and push it to them.

  sync.py           list what is out of sync, change nothing
  sync.py --apply   repair links here, push to the other machines, list what is still out of sync
  sync.py show X    print every line that contains X in each per-machine config file
"""

import hashlib
import json
import os
import shlex
import shutil
import subprocess
import sys
import time
from pathlib import Path

SOURCE = "Hasans-MacBook-Air"  # holds the real copies, so edits and syncs start here
MACHINES = ["agents-macmini"]

# Paths under ~ that every machine holds identically. A trailing "/" marks a folder that is
# synced child by child, so a child that only another machine has is removed there.
SHARED = [
    ".agents/skills/",
    ".codex/skills/pr",
    ".codex/AGENTS.md",
    ".codex/approvals.md",
    ".codex/auto-code-review.md",
    ".codex/global-code-standards.md",
    ".codex/process-lifetime.md",
    ".codex/remote-testing.md",
    ".codex/shipping-public-tools.md",
    ".codex/tool-accounts.md",
    ".codex/writing-style.md",
    ".codex-account-2/AGENTS.md",
    ".codex-account-2/auto-code-review.md",
    ".claude/skills/",
    ".claude/rules/",
    ".claude/hooks/",
    ".claude/CLAUDE.md",
    ".claude/delegation.md",
    ".claude/keybindings.json",
    ".claude/shipping-public-tools.md",
    ".claude/statusline-command.sh",
    ".claude-kaadr/skills",
    ".claude-kaadr/rules",
    ".claude-kaadr/CLAUDE.md",
    ".claude-kaadr/delegation.md",
    ".claude-kaadr/keybindings.json",
    ".claude-kaadr/settings.json",
    ".config/dcg/config.toml",
]
SECOND_ACCOUNTS = (".claude-kaadr/", ".codex-account-2/")  # hold links to the first account, never copies

# Each machine and account keeps its own copy of these, so they are edited by hand and never pushed.
CONFIGS = [
    ".claude/settings.json",
    ".claude.json",
    ".claude-kaadr/.claude.json",
    ".codex/config.toml",
    ".codex-account-2/config.toml",
    ".codex/hooks.json",
    ".codex-account-2/hooks.json",
    ".t3/userdata/settings.json",
]

LOCAL_ONLY = {".DS_Store", "__pycache__", ".trash", "synced", ".system"}  # never compared or pushed
BACKUPS = ".sync-harnesses-backups"
HOME = Path.home()


def units() -> list[str]:
    """The SHARED paths that exist on this machine, with each folder expanded to its children."""
    found = []
    for entry in SHARED:
        path = HOME / entry
        if not entry.endswith("/"):
            if os.path.lexists(path):
                found.append(entry)
        elif path.is_dir():
            found += [entry + name for name in sorted(os.listdir(path)) if name not in LOCAL_ONLY]
    return found


def fingerprint(path: Path) -> str:
    if path.is_symlink():
        return "link " + os.readlink(path)
    if path.is_file():
        executable = "x" if path.stat().st_mode & 0o100 else "-"
        return f"file {executable} {hashlib.sha256(path.read_bytes()).hexdigest()}"
    digest = hashlib.sha256()
    for child in sorted(path.iterdir()):
        if child.name not in LOCAL_ONLY:
            digest.update(f"{child.name}\0{fingerprint(child)}\0".encode())
    return "dir " + digest.hexdigest()


def snapshot() -> dict[str, str]:
    return {unit: fingerprint(HOME / unit) for unit in units()}


def links(path: Path):
    """Every symlink at or below path."""
    if path.is_symlink():
        yield path
    elif path.is_dir():
        for child in path.iterdir():
            if child.name not in LOCAL_ONLY:
                yield from links(child)


def local_problems(repair: bool) -> list[tuple[str, str]]:
    """What is wrong with the shared setup on this machine. With repair, absolute links become relative."""
    problems = [(entry, "missing") for entry in SHARED if not os.path.lexists(HOME / entry)]
    for unit in units():
        if unit.startswith(SECOND_ACCOUNTS) and not (HOME / unit).is_symlink():
            problems.append((unit, "is a copy, must be a link to the first account's file"))
        for link in links(HOME / unit):
            name = str(link.relative_to(HOME))
            target = os.readlink(link)
            if not link.exists():
                problems.append((name, f"broken link -> {target}"))
            elif not os.path.isabs(target):
                continue
            elif not target.startswith(f"{HOME}/"):
                problems.append((name, f"links outside the home folder -> {target}"))
            elif repair:
                link.unlink()
                link.symlink_to(os.path.relpath(target, link.parent))
            else:
                problems.append((name, "absolute link, breaks on a machine with another home folder"))
    return problems


def on_machine(host: str, *arguments: str) -> subprocess.CompletedProcess[str]:
    """Run this script on another machine by sending it over ssh, so that machine needs no copy of it."""
    command = shlex.join(["python3", "-", *arguments])
    with open(__file__, "rb") as script:
        return subprocess.run(
            ["ssh", "-o", "ConnectTimeout=10", host, command], stdin=script, capture_output=True, text=True
        )


def snapshot_of(host: str) -> dict[str, str]:
    result = on_machine(host, "snapshot")
    if result.returncode:
        raise SystemExit(
            f"{host}: could not read its setup: {result.stderr.strip()}\n"
            "If it is unreachable, start Tailscale: open -a Tailscale; "
            "/Applications/Tailscale.app/Contents/MacOS/Tailscale up"
        )
    return json.loads(result.stdout)


def differences(here: dict[str, str], there: dict[str, str]) -> list[tuple[str, str]]:
    rows = [(unit, "differs" if unit in there else "missing") for unit in here if here[unit] != there.get(unit)]
    return rows + [(unit, "extra") for unit in there if unit not in here]


def push(host: str, rows: list[tuple[str, str]]) -> str:
    """Send the changed units to host and swap them in. Returns where host keeps what it replaced."""
    stamp = time.strftime("%Y%m%d-%H%M%S")
    staging = f"{BACKUPS}/{stamp}/new"
    send = [unit for unit, state in rows if state != "extra"]
    if send:
        excludes = [flag for name in sorted(LOCAL_ONLY) for flag in ("--exclude", name)]
        tar = subprocess.Popen(
            ["tar", "-C", str(HOME), "-cf", "-", *excludes, *send],
            stdout=subprocess.PIPE, env={**os.environ, "COPYFILE_DISABLE": "1"},
        )
        unpack = f"mkdir -p ~/{staging} && tar -C ~/{staging} -xf -"
        received = subprocess.run(["ssh", host, unpack], stdin=tar.stdout, capture_output=True)
        if tar.wait() or received.returncode:
            raise SystemExit(f"{host}: could not send files: {received.stderr.decode().strip()}")
    installed = on_machine(host, "install", stamp, json.dumps(rows))
    if installed.returncode:
        raise SystemExit(f"{host}: could not install files: {installed.stderr.strip()}")
    return f"{host}:~/{BACKUPS}/{stamp}/old"


def install(stamp: str, rows: list[tuple[str, str]]) -> None:
    """Runs on the receiving machine: move each replaced unit into the backup, then the new one into place."""
    run = HOME / BACKUPS / stamp
    lost = [unit for unit, state in rows if state != "extra" and not os.path.lexists(run / "new" / unit)]
    if lost:
        raise SystemExit(f"did not arrive, so nothing was changed: {' '.join(lost)}")
    for unit, state in rows:
        place = HOME / unit
        if os.path.lexists(place):
            kept = run / "old" / unit
            kept.parent.mkdir(parents=True, exist_ok=True)
            place.rename(kept)
        if state != "extra":
            place.parent.mkdir(parents=True, exist_ok=True)
            (run / "new" / unit).rename(place)
    shutil.rmtree(run / "new", ignore_errors=True)


def show(text: str) -> None:
    files = " ".join(CONFIGS)
    grep = f"cd ~ && grep -n -F -- {shlex.quote(text)} {files} 2>/dev/null"
    for name, command in [("air", ["sh", "-c", grep])] + [(host, ["ssh", host, grep]) for host in MACHINES]:
        found = subprocess.run(command, capture_output=True, text=True).stdout
        for line in found.splitlines() or ["(no copy contains it)"]:
            print(f"{name:<15} {line[:200]}")


def main() -> None:
    arguments = sys.argv[1:]
    if arguments[:1] == ["snapshot"]:
        print(json.dumps(snapshot()))
        return
    if arguments[:1] == ["install"]:
        install(arguments[1], json.loads(arguments[2]))
        return
    # scutil, because the name the network reports for this machine changes between networks.
    if subprocess.run(["scutil", "--get", "LocalHostName"], capture_output=True, text=True).stdout.strip() != SOURCE:
        raise SystemExit(f"Run this on {SOURCE}. It holds the real copies, and a sync from it overwrites edits made here.")
    if arguments[:1] == ["show"] and len(arguments) == 2:
        show(arguments[1])
        return
    apply = arguments == ["--apply"]
    if arguments and not apply:
        raise SystemExit(__doc__)

    problems = local_problems(repair=apply)
    for name, what in problems:
        print(f"{'air':<15} {name:<44} {what}")
    if apply and problems:
        raise SystemExit("Fix the rows above by hand, then run again. Nothing was pushed.")

    here = snapshot()
    pending = len(problems)
    for host in MACHINES:
        rows = differences(here, snapshot_of(host))
        if apply and rows:
            print(f"pushed {len(rows)} to {host}; what it replaced is in {push(host, rows)}")
            rows = differences(here, snapshot_of(host))
        for unit, state in rows:
            print(f"{host:<15} {unit:<44} {state}")
        pending += len(rows)

    unlinked = sorted(set(os.listdir(HOME / ".agents/skills")) - set(os.listdir(HOME / ".claude/skills")) - LOCAL_ONLY)
    if unlinked:
        print("skills Claude does not have (no link in ~/.claude/skills): " + " ".join(unlinked))
    if pending:
        raise SystemExit(f"{pending} out of sync")
    print(f"in sync: {len(here)} shared paths on air, {', '.join(MACHINES)}")


if __name__ == "__main__":
    main()
