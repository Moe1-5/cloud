# AGENTS.md

Cross-tool instructions for any AI coding assistant working in this repo (Claude Code, Codex, Cursor, Aider, Copilot, etc.).

For the full project rules — session start, sprint workflow, folder ownership, code rules, testing protocol — see [CLAUDE.md](CLAUDE.md). Everything in CLAUDE.md applies to every assistant, not just Claude.

## Read Aloud Report (mandatory — coding assistants only)

End **every** coding-assistant response that completes meaningful repository work — and every development session wrap-up — with a final section headed exactly `## 🔊 Read Aloud`. The user consumes this through a text-to-speech tool, so it must be written for the ear:

- **Plain spoken prose only.** No bullets, no markdown symbols, no code blocks, no backticks, no emoji inside the spoken text, no raw file paths.
- **Spell things out for speech**: say "the App dot tsx file" not `App.tsx`, "sprint seven" not `sprint-07`.
- **Cumulative and self-contained**: cover what was asked, what changed and why, what was verified, and what's still open — understandable without seeing the rest of the response.
- Place it last, after all other output. If a response did no real work (a pure question/answer), the section may be skipped.
