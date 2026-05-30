# Day 39: Inspect and Compare Token Extension Configurations from the previous challenges tokens

--

## Lessons learned:

- Each token extension adds size to a token account. This in turns increases the rent cost for that account.

## Reference table from previously created Tokens
| Mint Address | Extensions Enabled | Account Data Size (bytes) | Rent Cost (SOL) | Mint Authority | Freeze Authority | Rate Authority | Transfer Fee Authority |
|---|---|---|---|---|---|---|---|
|8JZxygGWTPo2dUP1pirj42X15tMEJCPVLhAmfytDVGw7|Interest-bearing|222|0.002436|Solana CLI address|not set|Solana CLI address|N/A|
|EPsdwZwBa55WDte12JrbTMbyFEVNsyyGEmAn5nLn6A38|Interest-bearing, Transfer fees, (Metadata Pointer & Metadata)|599|0.005059|Solana CLI address|not set|Solana CLI address |Solana CLI address|
|H6TypuqGrTThvgmmJFgR3Fa53jvjqvnDG9LCfb3LfVyZ|Default State: Frozen|171|0.002081|Solana CLI address|Solana CLI address|N/A|N/A|
