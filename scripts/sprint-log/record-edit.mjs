// PostToolUse hook (Write|Edit|MultiEdit): records what kind of files were
// touched this session so the Stop hook can enforce the sprint-log rule.
// Always exits 0 — this script only observes, never blocks.
import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const STATE_DIR = join(".claude", "sprint-sessions");

// Source roots the template ships with. Add/remove entries here if a project
// uses a different layout (the rest of the system reads from recorded state).
const CODE_ROOTS = ["src/", "frontend/", "backend/", "mobile/", "app/"];

function classify(filePath) {
  const p = filePath.replace(/\\/g, "/").toLowerCase();
  if (p.includes("node_modules/") || p.includes("/target/")) return null;
  if (p.includes("tasks/sprints/")) return "sprint";
  if (CODE_ROOTS.some((root) => p.includes(root))) return "code";
  return null;
}

function main() {
  const input = JSON.parse(readFileSync(0, "utf8"));
  const sessionId = input.session_id || "unknown";
  const filePath = input.tool_input?.file_path || "";
  const kind = classify(filePath);
  if (!kind) return;

  mkdirSync(STATE_DIR, { recursive: true });
  const stateFile = join(STATE_DIR, `${sessionId}.json`);
  const state = existsSync(stateFile)
    ? JSON.parse(readFileSync(stateFile, "utf8"))
    : { codeEdited: false, sprintLogged: false, files: [] };

  const next = {
    codeEdited: state.codeEdited || kind === "code",
    sprintLogged: state.sprintLogged || kind === "sprint",
    files: state.files.includes(filePath) ? state.files : [...state.files, filePath],
  };
  writeFileSync(stateFile, JSON.stringify(next, null, 2));
}

try {
  main();
} catch {
  // Never break the session because bookkeeping failed.
}
process.exit(0);
