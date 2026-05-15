# Day 19: Make a transaction (tx) fail when sent on chain

## Lessons learned:
- Solana txs have 3 big steps:
  1. Processed: Meaning one validator saw your transaction and added it in a recent block
  2. Confirmed: Meaning 66%+ of validators voted on the block containing your transaction.
  3. Finalized: At least 31 additional confirmed blocks have been built on top of the one with your transaction.

- We made a tx get processed by sending it with a larger amount of SOL than available in our wallet and without getting checked before sending it. Check force-fail.mjs for more details. Thus getting the error of a failed tx on chain and still paying the tx fee for the compute done by validators.

- This exercise was useful to see what a failed tx that was broadcasted to the blockchain looks like and what can we do to check what went wrong in order to fix the error. It also showed the importance of checking every tx before sending it to the blockchain because we can always save the tx fee that way.
