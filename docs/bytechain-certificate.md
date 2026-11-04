# ByteChainCertificate — Non-Transferable Credential on Soroban

## Overview

ByteChainCertificate is a Soulbound Token (SBT) — a non-transferable on-chain credential minted when a student completes a course on ByteChain Academy. The token is permanently bound to the student's Stellar wallet address and cannot be transferred, sold, or traded.

This document covers the contract design, storage model, authorization, events, and integration with the existing backend certificate verification flow.

## Goals

- Mint a non-transferable token upon course completion
- Store certificate metadata on IPFS, referenced via token URI
- Allow on-chain verification by the frontend's "verify-certificate" page
- Prevent any transfer or reuse of the credential
- Support revocation by authorized admins (e.g., if a course is found to be fraudulent)

## Non-goals

- Transferable NFTs (use a standard Soroban token for that)
- Tradable certificates
- On-chain storage of full certificate data (metadata lives on IPFS)

## Contract interface

### Data structures

```rust
// Certificate metadata stored on-chain (minimal)
struct CertificateData {
    course_id: BytesN<32>,       // backend course UUID (hashed)
    recipient_name: String,      // student display name
    course_name: String,          // course title at time of mint
    issued_at: u64,               // timestamp
    token_uri: String,            // IPFS URI for full metadata
    revoked: bool,                // revocation flag
}
```

### Functions

| Function | Auth | Description |
|----------|------|-------------|
| `mint(to, course_id, recipient_name, course_name, token_uri)` | Admin/Backend | Mint a new certificate to a wallet address. Fails if the address already holds a certificate for the same course. |
| `revoke(token_id)` | Admin | Mark a certificate as revoked. |
| `owner_of(token_id)` | Public | Return the owner's wallet address. |
| `token_uri(token_id)` | Public | Return the IPFS URI for the certificate metadata. |
| `is_revoked(token_id)` | Public | Return revocation status. |
| `balance_of(address)` | Public | Return number of certificates held by an address. |
| `transfer(from, to, token_id)` | — | Always reverts. Certificates are non-transferable. |

### Events

```rust
// Emitted on mint
event Mint { owner: Address, token_id: u64, course_id: BytesN<32>, token_uri: String }

// Emitted on revocation
event Revoke { token_id: u64, reason: String }
```

## Authorization

- **Minter role**: The backend service account (a dedicated Stellar keypair) is authorized to mint certificates. This is set during contract deployment and can be rotated by the admin.
- **Admin role**: The contract deployer is the initial admin. Admins can add/remove minters and revoke certificates.
- **No transfer**: The `transfer` function is explicitly implemented to always revert, regardless of caller.

## Storage model

Soroban persistent storage:

| Key | Value | Notes |
|-----|-------|-------|
| `token:{id}` | `CertificateData` | Per-token metadata |
| `owner:{address}` | `Vec<u64>` | Token IDs owned by an address |
| `token_owner:{id}` | `Address` | Reverse lookup |
| `next_id` | `u64` | Auto-increment counter |
| `minters:{address}` | `bool` | Minter authorization |
| `admin` | `Address` | Current admin |

## IPFS metadata schema

The token URI points to an IPFS document with:

```json
{
  "name": "ByteChain Certificate: {course_name}",
  "description": "Course completion certificate for {recipient_name}",
  "image": "ipfs://{certificate_image_hash}",
  "attributes": [
    { "trait_type": "Course", "value": "{course_name}" },
    { "trait_type": "Recipient", "value": "{recipient_name}" },
    { "trait_type": "Issued At", "value": "{iso_timestamp}" },
    { "trait_type": "Course ID", "value": "{course_uuid}" }
  ]
}
```

## Integration with backend

1. Student completes a course → backend marks course as completed
2. Backend calls `mint(student_wallet, course_id, ...)` on the Soroban contract
3. Backend stores the on-chain token ID alongside the existing certificate record
4. Frontend "verify-certificate" page queries the contract directly (via Stellar RPC) instead of the database
5. If the certificate is revoked on-chain, the frontend shows "revoked" status

## Security considerations

- **No transfer**: The contract must not expose any function that changes ownership after minting.
- **Revocation**: Only admins can revoke. Revocation is permanent (no un-revoke).
- **Duplicate prevention**: A wallet can only hold one certificate per course ID.
- **Reentrancy**: Soroban's WASM execution model prevents reentrancy, but input validation is still required.
- **Metadata immutability**: The token URI is set at mint time and cannot be changed afterward.

## Testing plan

- Mint succeeds for a new address/course combination
- Mint fails for duplicate (same address + same course)
- `transfer` always reverts
- Revocation works and `is_revoked` returns true
- `owner_of` and `token_uri` return correct values
- Unauthorized mint attempt fails
- Balance tracking is accurate across multiple mints

## Future extensions

- Batch minting for cohort completions
- Expiry timestamps for time-limited certifications
- On-chain course hash verification (compare backend course data hash)
