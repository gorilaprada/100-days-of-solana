# Day 18: Add a transaction status tracker to the CLI transfer tool

## Lessons learned:
- Solana transactions have 3 big steps:
  1. Processed: Meaning one validator saw your transaction and added it in a recent block
  2. Confirmed: Meaning 66%+ of validators voted on the block containing your transaction.
  3. Finalized: At least 31 additional confirmed blocks have been built on top of the one with your transaction.
