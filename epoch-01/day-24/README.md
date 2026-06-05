# Day 24: Learning how to decode the Solana account state (flat array of bytes) into human readable information

## Lessons Learned:
- Solana account states are in a [Borsh](https://borsh.io/) format 

- How to use the @Solana/kit getMintDecoder() to access the useful information in a Solana account state

- How to manually extract account state by slicing the bytes and rendering them.

- How to use the jsonParsed encoding combined with the @Solana/kit getAccountInfo() to once again access the account state
