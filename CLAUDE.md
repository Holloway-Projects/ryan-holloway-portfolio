@AGENTS.md

## Claude Code specifics

Everything above comes from `AGENTS.md`, shared with Codex. Edit project rules there, not here; this section is
only for things that apply to Claude Code alone.

- Ryan's live view: `preview_start` with the `dev` entry in `.claude/launch.json` (`npm run dev`, port 4321) opens
  the site in the built-in browser pane with live reload. Start it at session start and leave it running.
- Production check: the `preview` entry serves the built `dist/` on port 4322. Run `npm run build` first, and
  stop it when done.
- At session end stop both servers and close the tabs. The hero plays with sound on.
- For Ryan, commit and push without asking, as the procedure says. That is standing authorisation from Kyle for
  this repo's `main`; it does not extend to force pushes or to any other repo.
