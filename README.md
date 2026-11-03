# bytechain-contracts

Smart contracts for **ByteChain Academy** — on-chain DAO governance, Soulbound Token (SBT) certificates, and a platform reward token. This is the source of truth for all on-chain logic in the ByteChain ecosystem.

## Part of the ByteChain Academy multi-repo ecosystem

| Repo | Purpose |
|------|---------|
| [bytechain-academy-frontend](https://github.com/WeAcademy/bytechain-academy-frontend) | Next.js web app — UI for students, tutors, and admins |
| [bytechain-academy-backend](https://github.com/WeAcademy/bytechain-academy-backend) | NestJS REST API — auth, courses, progress, DAO, certificates |
| [bytechain-currency-hub](https://github.com/WeAcademy/bytechain-currency-hub) | Standalone crypto currency history data service |
| **bytechain-contracts** (this repo) | Smart contracts — DAO governance, SBT certificates, reward token |
| [bytechain-indexer](https://github.com/WeAcademy/bytechain-indexer) | On-chain event listener that syncs blockchain state to the backend |
| [bytechain-shared](https://github.com/WeAcademy/bytechain-shared) | Shared TypeScript types and contract ABIs used across all repos |

---

## Contracts

### 1. ByteChainDAO
On-chain governance contract replacing the current off-chain DAO module in the backend. Proposal creation, voting (YES / NO / ABSTAIN), and automatic resolution all happen as on-chain transactions. Users' voting power is determined by their token balance or XP-linked stake.

### 2. ByteChainCertificate (SBT)
A Soulbound Token (non-transferable NFT) minted when a student completes a course. The token is permanently tied to the student's wallet address. Metadata (course name, completion date, student name) is stored on IPFS and referenced via the token URI. The `verify-certificate` page in the frontend will verify against this contract rather than the database.

### 3. ByteChainToken (BCT)
A Stellar Soroban token backing the platform's XP and reward system. Earned by completing lessons, quizzes, and participating in governance. Used for staking voting power in the DAO.

---

## Tech stack

| Tool | Purpose |
|------|---------|
| Rust (stable) | Contract language |
| [soroban-sdk](https://crates.io/crates/soroban-sdk) 29.0.1 | Contract types, storage, auth and test utilities |
| [Stellar CLI](https://developers.stellar.org/docs/tools/developer-tools/cli/stellar-cli) 25.2+ | Building optimised Wasm, deploying and invoking contracts |
| Cargo workspace | Shared dependency versions and one test/lint surface |
| GitHub Actions | `cargo fmt`, `cargo clippy` and `cargo test` on every PR |

## Repository structure

```
bytechain-contracts/
├── Cargo.toml                  ← workspace manifest and shared release profile
├── Cargo.lock
├── rust-toolchain.toml         ← stable + wasm32v1-none + rustfmt/clippy
├── contracts/
│   └── hello-world/            ← starter crate proving the toolchain
│       ├── Cargo.toml
│       └── src/{lib.rs,test.rs}
└── .github/workflows/ci.yml
```

`contracts/hello-world` is intentionally trivial. It verifies that the
workspace, SDK and CI are wired correctly before the DAO, certificate and token
contracts are implemented from their design docs.

## Getting started

Prerequisites: Rust stable (1.84+), the `wasm32v1-none` target and Stellar CLI
25.2+.

```bash
git clone https://github.com/WeAcademy/bytechain-contracts.git
cd bytechain-contracts
rustup target add wasm32v1-none
cargo install --locked stellar-cli --features opt   # if not installed

# Format, lint and test
cargo fmt --all -- --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace

# Build optimised Wasm into target/wasm32v1-none/release/
stellar contract build
```

Deploy the starter contract to testnet:

```bash
stellar keys generate --global alice --network testnet
stellar contract deploy \
  --wasm target/wasm32v1-none/release/bytechain_hello_world.wasm \
  --source alice \
  --network testnet
```

## Adding a contract

1. Create the crate: `cargo new --lib contracts/<name>`.
2. Set `crate-type = ["cdylib", "rlib"]`, use the workspace `soroban-sdk`
   dependency and add `soroban-sdk` with the `testutils` feature under
   `[dev-dependencies]`.
3. Add the crate path to `members` in the root `Cargo.toml`.
4. Cover the public entry points with `soroban_sdk::Env` unit tests.
5. Run `cargo test --workspace`, `cargo clippy --workspace --all-targets -- -D warnings`
   and `stellar contract build` before opening a PR.

## Environment variables

There are no committed environment variables. Deployer keys and network
configuration are managed by Stellar CLI identities (`stellar keys`) and its
network config.

## Contributing

See [CONTRIBUTING.md](https://github.com/WeAcademy/ByteChain-Academy/blob/main/CONTRIBUTING.md) for branch naming, PR standards, and the Drips Wave contribution workflow.

## License

MIT
