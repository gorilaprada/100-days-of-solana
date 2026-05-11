# Day 15: Learning more about transactions on the Solana blockchain

## Lesson learned:
- Every transaction on Solana has the same skeleton:
  1. Signatures
  2. Account keys
  3. Recent blockhash
  4. Instructions
- The whole transaction information must be stored in 1,232 bytes because the IPv6 minimum MTU.

