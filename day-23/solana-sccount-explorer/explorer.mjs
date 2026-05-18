import { createSolanaRpc, devnet, address } from "@solana/kit";

const KNOWN_PROGRAMS = {
  "11111111111111111111111111111111": "System Program",
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA": "Token Program",
  "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb": "Token-2022 Program",
  "BPFLoaderUpgradeab1e11111111111111111111111": "BPF Upgradeable Loader",
};
const RPC_URL = "https://api.devnet.solana.com";
const rpc = createSolanaRpc(devnet(RPC_URL));

// Helper function 
function getOwnerLabel(ownerAddress) {
  return KNOWN_PROGRAMS[ownerAddress] || ownerAddress;
}

// Getting address from CLI input
const inputAddress = process.argv[2];

if (!inputAddress) {
  console.error("Usage: node explorer.mjs <SOLANA_ADDRESS");
  process.exit(1);
}

const targetAddress = address(inputAddress);

// Balance and Info
const { value: balanceLamports } = await rpc.getBalance(targetAddress).send();
const balanceInSOL = Number(balanceLamports) / 1_000_000_000;

const { value: accountInfo } = await rpc
  .getAccountInfo(targetAddress, { encoding: "base64" })
  .send();

// Printing account info
console.log(`
===== Solana Account Explorer =====

Address: ${inputAddress}
Balance: ${balanceInSOL} SOL (${balanceLamports.toString()}) lamports
`)

if (!accountInfo) {
  console.log(`Status:   Account not found on chain`)
} else {
  const owner = accountInfo.owner;
  const dataLength = accountInfo.data[0]
    ? Buffer.from(accountInfo.data[0], "base64").length
    : 0;

  console.log(`
Owner:      ${getOwnerLabel(owner)} (${owner})
Executable: ${accountInfo.executable}
Data size:  ${dataLength} bytes
Rent epoch: ${accountInfo.rentEpoch}

`)

  if (dataLength > 0 && dataLength <= 128) {
    const raw = Buffer.from(accountInfo.data[0], "base64");
    console.log(`Data (hex): ${raw.toString("hex")}`);
  } else if (dataLength > 128) {
    const raw = Buffer.from(accountInfo.data[0], "base64");
    console.log(`Data (hex): ${raw.toString("hex").slice(0, 256)}... (truncated)`);
  }
}

console.log(
  `\nView on explorer: https://explorer.solana.com/address/${inputAddress}?cluster=devnet`
);
