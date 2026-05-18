# Day 22: Inspecting account data

## Lessons Learned:
- Everything on Solana is an account with 5 fields:
  1. Lamports
  2. Data
  3. Owner
  4. Executable
  5. rentEpoch

- The owner's field is very important to know who/what can modify an account's data and/or add/deduct lamports.
