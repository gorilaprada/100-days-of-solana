# Day 45: Create a on-chain NFT collection

## Lessons learned:

- You can enable the Group Token Extension for an account, and, put other solana accounts (e.g. NFTs) as members of that groups. That makes a collection. Everything is linked on-chain whihc removes the need for thirds party collection linkers.

### Solana CLI commands used:
```bash
spl-token create-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb \
  --decimals 0 \
  --enable-metadata \
  --enable-group

spl-token initialize-metadata

spl-token initialize-group

spl-token create-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb \
  --decimals 0 \
  --enable-metadata \
  --enable-member

spl-token initialize-member MEMBER_ONE_MINT COLLECTION_MINT

spl-token create-account MEMBER_ONE_MINT
spl-token mint MEMBER_ONE_MINT 1
spl-token authorize MEMBER_ONE_MINT mint --disable
```
