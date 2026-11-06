# Contributing to bytechain-contracts

Thanks for helping build ByteChain Academy. This repository holds the Soroban
smart contracts and the `packages/ts-bindings` TypeScript package. The
maintainer is [@TomikeDS](https://github.com/TomikeDS).

## Before you start

1. Find an open issue, or open one describing what you want to change.
2. Comment on the issue to ask for it to be assigned to you. Please wait for
   assignment before starting, so two people do not do the same work.
3. Issues labelled `good first issue` are scoped for newcomers. Issues that
   are part of a Drips Wave or GrantFox cycle say so in the issue body.

## Local setup

Contracts:

```bash
rustup target add wasm32v1-none
cargo install --locked stellar-cli --features opt   # optional, for build/deploy
cargo fmt --all -- --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace
```

TypeScript package:

```bash
cd packages/ts-bindings
npm ci
npm run lint && npm run typecheck && npm test && npm run build
```

## Branches and commits

- Branch from `main` and name the branch `<type>/<issue-number>-<short-name>`,
  for example `feat/12-certificate-mint` or `docs/20-dao-readme`.
- Use [Conventional Commits](https://www.conventionalcommits.org/) for commit
  messages: `feat:`, `fix:`, `docs:`, `test:`, `chore:`, `refactor:`.

## Pull requests

- Link the issue with `Closes #<number>` in the PR description.
- Keep each PR to one issue.
- CI must pass: `cargo fmt`, `cargo clippy`, `cargo test` and the wasm build for
  contracts, and lint, typecheck, test and build for `packages/ts-bindings`.
- Every new or changed public contract function needs unit tests using
  `soroban_sdk::Env`.
- If you change a contract's public interface or events, say so in the PR. The
  TypeScript bindings and the indexer usually need a matching change.

## Cross-repo changes

| You changed | Also check |
|---|---|
| A contract function signature | regenerate bindings in `packages/ts-bindings` |
| A contract event | `bytechain-indexer` listeners |
| A type in `packages/ts-bindings/src/types` | `bytechain-academy-backend` DTOs and `bytechain-academy-frontend` usage |

## Code of conduct

By taking part you agree to follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Security

Do not open public issues for vulnerabilities. See [SECURITY.md](SECURITY.md).
