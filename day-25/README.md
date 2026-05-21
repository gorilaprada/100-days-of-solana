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

- Native programs (e.g [System Program](https://explorer.solana.com/address/11111111111111111111111111111111?cluster=devnet), [Stake Program](https://explorer.solana.com/address/Stake11111111111111111111111111111111111111?cluster=devnet)) hold program bytecode data. They are executable and owned by the [Native Loader](https://explorer.solana.com/address/BPFLoaderUpgradeab1e11111111111111111111111?cluster=devnet).

- Sysvar accounts (e.g. [Clock sysvar](https://explorer.solana.com/address/SysvarC1ock11111111111111111111111111111111?cluster=devnet)) hold read-only cluster state data. They are not executable and are owned by the [Sysvar program](https://explorer.solana.com/address/Sysvar1111111111111111111111111111111111111?cluster=devnet).

