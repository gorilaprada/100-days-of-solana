import { createSolanaRpc, devnet, address } from "npm:@solana/kit";

const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));
const walletAddress = Deno.env.get("PUB_ADDRESS");

const targetAddress = address(walletAddress);

const signatures = await rpc
  .getSignaturesForAddress(targetAddress, { limit: 5 })
  .send();

console.log(`\nLast 5 transactions for ${targetAddress}:\n`);

for (const tx of signatures) {
  const time = tx.blockTime
    ? new Date(Number(tx.blockTime) * 1000).toLocaleString()
    : "unknown";

  console.log(`
    Signature : ${tx.signature}
    Slot      : ${tx.slot}
    Time      : ${time}
    Status    : ${tx.err ? "Failed" : "Success"}
    ---
  `);
}
