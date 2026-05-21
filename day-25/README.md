## Day 25: Exploring Solana's account model

# Lessons Learned:
- Every account on Solana shares the same five fields of information:
  1. lamports
  2. data
  3. owner
  4. executable
  5. rent_epoch

- Solana wallets, programs and cluster-wide variables are all accounts

- System accounts (e.g Your typical Solana wallet) have zero data, are not executable and are owned by the System Program

- Native programs (e.g [System Program](#system-program), [Stake Program](#stake-program)) hold program bytecode data. They are executable and owned by the [Native Loader](#native-loader).

- Sysvar accounts (e.g. [Clock sysvar](#clock-sysvar)) hold read-only cluster state data. They are not executable and are owned by the [Sysvar program](#sysvar-program).



Account References:
11111111111111111111111111111111 {#system-program}
Stake11111111111111111111111111111111111111 {#stake-program}
BPFLoaderUpgradeab1e11111111111111111111111 {#native-loader}
SysvarC1ock11111111111111111111111111111111 {#clock-sysvar}
Sysvar1111111111111111111111111111111111111 {#sysvar-program}
