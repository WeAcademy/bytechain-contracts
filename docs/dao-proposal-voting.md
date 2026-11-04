# ByteChainDAO — Proposal and Voting Contract on Soroban

## Overview

ByteChainDAO is an on-chain governance contract that ports the existing backend DAO module to Soroban. It enables proposal creation, voting (YES / NO / ABSTAIN), and automatic resolution as on-chain transactions. Voting power is determined by the voter's ByteChainToken (BCT) balance at the time of voting.

This document covers the contract design, storage model, voting power, lifecycle, events, and integration with the backend DAO module.

## Current backend implementation (reference)

The backend `dao` module currently provides:
- **Proposals**: title, description, proposer, status (ACTIVE/PASSED/REJECTED/WITHDRAWN), voting deadline, vote counts (yes/no/abstain)
- **Votes**: one vote per user per proposal, vote type (YES/NO/ABSTAIN)
- **Moderation**: admin can moderate proposals with a reason
- **Auto-resolution**: proposals auto-resolve based on vote counts after the deadline

The on-chain port will preserve this behavior while adding token-weighted voting power.

## Goals

- Port the backend DAO module to a Soroban contract
- Token-weighted voting (1 BCT = 1 vote power)
- Proposal creation, voting, withdrawal, and auto-resolution on-chain
- Admin moderation capability
- Events for indexer to sync state to the backend

## Non-goals

- Delegated voting (future)
- Quadratic voting (future)
- On-chain execution of proposal outcomes (governance-only, not execution)

## Contract interface

### Data structures

```rust
enum ProposalStatus { Active, Passed, Rejected, Withdrawn }

enum VoteType { Yes, No, Abstain }

struct Proposal {
    id: u64,
    title: String,
    description: String,
    proposer: Address,
    status: ProposalStatus,
    voting_deadline: u64,       // ledger timestamp
    yes_power: i128,            // sum of voting power of YES votes
    no_power: i128,             // sum of voting power of NO votes
    abstain_power: i128,        // sum of voting power of ABSTAIN votes
    created_at: u64,
    moderation_reason: Option<String>,
    moderated_at: Option<u64>,
    moderator: Option<Address>,
}

struct Vote {
    proposal_id: u64,
    voter: Address,
    vote: VoteType,
    voting_power: i128,          // snapshot of voter's BCT balance at vote time
    cast_at: u64,
}
```

### Functions

| Function | Auth | Description |
|----------|------|-------------|
| `create_proposal(title, description, voting_deadline)` | Any BCT holder | Create a new proposal. Requires non-zero BCT balance. |
| `cast_vote(proposal_id, vote_type)` | Any BCT holder | Cast a vote. One vote per address per proposal. Voting power = BCT balance at time of voting. |
| `withdraw_proposal(proposal_id)` | Proposer only | Withdraw an active proposal. Only allowed before any votes are cast. |
| `moderate_proposal(proposal_id, reason)` | Admin only | Set proposal status to WITHDRAWN with a reason. |
| `resolve_proposal(proposal_id)` | Public (auto or anyone) | After the deadline, tally votes and set PASSED or REJECTED. |
| `get_proposal(proposal_id)` | Public | Return proposal details. |
| `get_vote(proposal_id, voter)` | Public | Return a voter's vote on a proposal. |
| `get_proposals(status, page, page_size)` | Public | Paginated list of proposals by status. |

### Events

```rust
event ProposalCreated { id: u64, proposer: Address, title: String, voting_deadline: u64 }
event VoteCast { proposal_id: u64, voter: Address, vote: VoteType, voting_power: i128 }
event ProposalResolved { id: u64, status: ProposalStatus, yes_power: i128, no_power: i128 }
event ProposalWithdrawn { id: u64, proposer: Address }
event ProposalModerated { id: u64, moderator: Address, reason: String }
```

## Voting power

- Voting power = the voter's ByteChainToken (BCT) balance at the time they cast their vote.
- The contract reads the BCT balance via a cross-contract call to the ByteChainToken contract.
- Power is snapshotted per-vote (no balance changes after voting affect the tally).
- If a voter's BCT balance is zero, they cannot vote.

## Resolution rules

- After `voting_deadline`, anyone can call `resolve_proposal`.
- **PASSED**: `yes_power > no_power` (abstain power is neutral).
- **REJECTED**: `no_power >= yes_power`.
- If no votes are cast, the proposal is REJECTED.
- Resolution is idempotent (calling it on an already-resolved proposal reverts).

## Storage model

| Key | Value | Notes |
|-----|-------|-------|
| `proposal:{id}` | `Proposal` | Per-proposal data |
| `vote:{proposal_id}:{voter}` | `Vote` | Per-voter vote on a proposal |
| `proposal_count` | `u64` | Auto-increment for proposal IDs |
| `bct_contract` | `Address` | ByteChainToken contract address for cross-contract calls |
| `admin` | `Address` | Current admin |
| `min_bct_to_propose` | `i128` | Minimum BCT balance to create a proposal |

## Admin operations

- Set BCT contract address (for cross-contract balance reads)
- Set minimum BCT balance required to create a proposal
- Moderate (withdraw) proposals with a reason
- Transfer admin role

## Backend integration

1. **Indexer sync**: The bytechain-indexer listens to contract events and writes them to the backend database.
2. **Read fallback**: The backend can query the contract directly via Stellar RPC for proposal/vote data.
3. **Migration**: Existing off-chain proposals are NOT migrated on-chain. New proposals go through the contract.
4. **Frontend**: The frontend reads proposals from the backend (synced via indexer) and submits votes through a Stellar wallet (Freighter or similar).

## Security considerations

- **Double voting prevention**: One vote per address per proposal, enforced by storage key.
- **Proposal spam prevention**: Minimum BCT balance required to create proposals.
- **Withdrawal protection**: Proposals can only be withdrawn before any votes are cast.
- **Deadline enforcement**: Voting after the deadline reverts.
- **Resolution idempotency**: Resolving an already-resolved proposal reverts.
- **Cross-contract trust**: The BCT contract address is set by admin and should be verified on deployment.

## Testing plan

- Create proposal with sufficient BCT balance
- Create proposal fails with zero BCT
- Cast YES/NO/ABSTAIN votes with correct power
- Double vote reverts
- Vote after deadline reverts
- Withdraw proposal before any votes
- Withdraw after votes reverts
- Moderate proposal as admin
- Non-admin moderate fails
- Resolve proposal: yes_power > no_power → PASSED
- Resolve proposal: no_power >= yes_power → REJECTED
- Resolve proposal: no votes → REJECTED
- Double resolve reverts
- Pagination works correctly

## Future extensions

- Delegated voting (delegate your voting power to another address)
- Quorum requirements (minimum participation for validity)
- Timelock execution (proposal outcome triggers a contract action after a delay)
- Weighted voting (e.g., quadratic or time-weighted)
