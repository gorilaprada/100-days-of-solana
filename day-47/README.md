# Day 47: Mutate Token metadata

## Lessons learned:
- Tokens can have a metadata update authority. This authority (an acocunt) can change the metadata fields that are stored on chain. The change will be reflected immediately on block explorers.

### Commands used:
```bash
spl-token update-metadata [MINT_ADDRESS] name "Test Coin"
spl-token update-metadata [MINT_ADDRESS] rarity common
spl-token update-metadata [MINT_ADDRESS] rarity --remove
spl-token update-metadata [MINT_ADDRESS] uri https://another.uri
```
