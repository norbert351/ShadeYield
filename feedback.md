# Feedback on iExec Nox Tools

## WTF Hackathon — iExec Nox Integration Feedback

### Overall Impression
iExec Nox provides a genuinely novel primitive for DeFi: **encrypted on-chain state that remains composable with standard protocols**. The ability to store `euint256` balances that can be processed with encrypted math operations (`Nox.add`, `Nox.div`, `Nox.select`) while keeping the underlying values private is powerful for privacy-focused financial applications.

### What Worked Well

**1. Smart Contract Integration (`Nox.sol`)**
- The Nox SDK methods (`toEuint256`, `fromExternal`, `add`, `div`, `select`) integrate naturally into Solidity — no DSL to learn, just new types.
- The `allowPublicDecryption` flag on `totalAssets` lets us show vault TVL publicly while individual shares stay encrypted.
- Constructor-level initialization via `Nox.fromExternal` with pre-encrypted handles works cleanly for setting initial zero state.

**2. Nox Handle Client (`@iexec-nox/handle`)**
- The `createViemHandleClient` function provides a straightforward way to encrypt initial values off-chain before deployment.
- `encryptInput` and `publicDecrypt` are well-documented and work reliably.

**3. Type Safety**
- `euint256`, `ebool`, `externalEuint256` provide strong typing that prevents accidental plaintext leakage.

**4. Deployment**
- Contracts compile and deploy without modification to existing tooling (Hardhat, Foundry). No special deployer needed.

### Pain Points & Improvement Suggestions

**1. Nox Precompile on Sepolia**
- The Nox precompile at `0xd464B198f06756a1d00be223634b85E0a731c229` works on both Arbitrum Sepolia and ETH Sepolia, but there's no easy way to verify its presence without attempting a call. A simple `NoxCompute.isAvailable()` view function would help.

**2. Off-chain Decryption Setup**
- The `publicDecrypt` flow requires running a separate API server with the Nox handle client. There's no hosted/cloud option — every developer must run their own.
- A managed decrypt endpoint (e.g., `api.iex.ec/nox/decrypt`) would dramatically lower the barrier for demos and hackathons.

**3. Error Messages**
- When encrypted operations fail (e.g., `Nox.fromExternal` with wrong proof), the revert reason can be opaque. More descriptive error messages would speed up debugging.

**4. Documentation Gaps**
- The Nox SDK README covers basic usage but misses patterns like:
  - How to handle `euint256` in hardhat tests
  - Best practices for `Nox.allow` and `Nox.allowPublicDecryption` scoping
  - Gas costs of encrypted operations vs plain uint256

**5. No Native Test Helpers**
- Writing unit tests for Nox contracts requires mocking the precompile or running a full TEE, which is not feasible locally. Precompiled test mocks or a local Nox simulator would help.

### Recommendations for Future Builders

1. **Start with the Nox probe contract** — deploy a simple test contract that calls the Nox precompile before building your full application.
2. **Use `allowPublicDecryption` sparingly** — only enable it on fields that genuinely need public visibility (like TVL).
3. **Separate encrypted and plain state** — keep strategy positions (which interact with public protocols) as plain uint256, and only encrypt user share balances.
4. **Plan for the off-chain decrypt API early** — the encryption is the easy part; the decryption infrastructure (API + TEE) takes more time to set up.

### Summary

iExec Nox is the only production-ready confidential computing layer for Ethereum that doesn't require modifications to underlying protocols. The encrypted math operations work reliably, the SDK is well-designed, and the privacy guarantees are real. The main friction points are off-chain infrastructure (decrypt API setup) and documentation depth, both of which are solvable with time and community growth.

**Rating: 4/5** — Powerful primitive, needs more off-chain tooling and documentation for mainstream adoption.
