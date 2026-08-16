# Agent configs

The working rules Hasan Shoaib uses across Claude Code, Codex, and Pi.

The two entry points share the same principles:

- [`AGENTS.md`](./AGENTS.md) configures Codex-compatible agents.
- [`CLAUDE.md`](./CLAUDE.md) configures Claude Code.

Focused guidance lives in [`docs/`](./docs):

- [`delegation.md`](./docs/delegation.md)
- [`writing-style.md`](./docs/writing-style.md)
- [`code-standards.md`](./docs/code-standards.md)
- [`code-review.md`](./docs/code-review.md)

Machine paths, credentials, account names, deployment identifiers, caches, session state, and private operational notes are intentionally excluded. The public files are the reusable policy layer, not a backup of a home directory.

## Use

Copy the relevant entry point into a project or use it as the base for your global agent instructions. Adjust paths and tool names to match your environment.

## License

MIT
