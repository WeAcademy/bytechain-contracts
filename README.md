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
An ERC-20 (or Stellar Soroban token) backing the platform's XP and reward system. Earned by completing lessons, quizzes, and participating in governance. Used for staking voting power in the DAO.

---

## Tech stack (planned)

| Tool | Purpose |
|------|---------|
| Hardhat or Foundry | Contract development, testing, and deployment |
| Solidity ^0.8 | Contract language (EVM path) |
| OpenZeppelin Contracts | DAO Governor, ERC-20, ERC-721 base contracts |
| TypeChain | Auto-generate TypeScript types from ABIs |
| Hardhat Ignition | Deterministic deployment scripts |
| IPFS / Pinata | Certificate metadata storage |

> **Alternative path:** If the project stays on Stellar, contracts will be written in Rust using the Soroban SDK and deployed to the Stellar testnet / mainnet.
>
> ---
>
> ## Repository structure (planned)
>
> ```
> bytechain-contracts/
> ├── contracts/
> │   ├── ByteChainDAO.sol
> │   ├── ByteChainCertificate.sol
> │   └── ByteChainToken.sol
> ├── scripts/
> │   └── deploy.ts
> ├── test/
> │   ├── ByteChainDAO.test.ts
> │   ├── ByteChainCertificate.test.ts
> │   └── ByteChainToken.test.ts
> ├── ignition/
> │   └── modules/
> ├── abis/                  ← exported and consumed by bytechain-shared
> ├── hardhat.config.ts
> └── package.json
> ```
>
> ---
>
> ## Getting started (once implemented)
>
> ```bash
> git clone https://github.com/WeAcademy/bytechain-contracts.git
> cd bytechain-contracts
> npm install
>
> # Run tests
> npx hardhat test
>
> # Deploy to local node
> npx hardhat node
> npx hardhat ignition deploy ./ignition/modules/ByteChain.ts --network localhost
>
> # Deploy to testnet
> npx hardhat ignition deploy ./ignition/modules/ByteChain.ts --network sepolia
> ```
>
> ---
>
> ## Environment variables
>
> ```bash
> PRIVATE_KEY=           # Deployer wallet private key
> INFURA_API_KEY=        # Or Alchemy API key for RPC access
> ETHERSCAN_API_KEY=     # For contract verification
> ```
>
> ---
>
> ## Contributing
>
> See [CONTRIBUTING.md](https://github.com/WeAcademy/ByteChain-Academy/blob/main/CONTRIBUTING.md) for branch naming, PR standards, and the Drips Wave contribution workflow.
>
> ## License
>
> MIT
