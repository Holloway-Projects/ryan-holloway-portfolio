@AGENTS.md

## Claude Code specifics

Everything above comes from `AGENTS.md`, shared with Codex. Edit project rules there, not here; this section is
only for things that apply to Claude Code alone.

- To verify in a browser, use the `preview` entry in `.claude/launch.json` (`npx astro preview`, port 4321) with
  the built-in browser pane, or the Chrome DevTools MCP / Claude in Chrome if that is what the session has.
  Run `npm run build` first; preview serves `dist/`.
- When verification is done, stop the preview server and close the browser tab. The hero plays with sound on.
- For Ryan, commit and push without asking, as the procedure says. That is standing authorisation from Kyle for
  this repo's `main`; it does not extend to force pushes or to any other repo.
