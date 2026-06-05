import {
  createSolanaRpc,
  address,
  getBase58Decoder,
  getBase64Encoder,
  getBase16Decoder,
} from "@solana/kit";

import { getMintDecoder } from "@solana-program/token";

const rpc = createSolanaRpc("https://api.mainnet-beta.solana.com");

// Wrapped SOL mint address
const mintAddress = address("So11111111111111111111111111111111111111112");

// 1. Fetch raw JSON data
const { value: accountInfo } = await rpc
  .getAccountInfo(mintAddress, { encoding: "base64" })
  .send();

// `data` arrives as a [base64String, "base64"] tuple. Convert the string back into the raw 82 bytes.
const dataBytes = getBase64Encoder().encode(accountInfo.data[0]);

console.log(`
Owner program: ${accountInfo.owner}
Data length: ${dataBytes.length} bytes
Raw data (hex): ${getBase16Decoder().decode(dataBytes)}
`);

// 2. Decode with the Token Program Mint codec
const mint = getMintDecoder().decode(dataBytes);

const codecMintAuthority =
  mint.mintAuthority.__option === "Some" ? mint.mintAuthority.value : "None";

const codecFreezeAuthority =
  mint.freezeAuthority.__option === "Some" ? mint.freezeAuthority.value : "None";

console.log(`

--- Decoded With Token Program Codec ---
Mint Authority: ${codecMintAuthority}
Supply: ${mint.supply.toString()}
Decimals: ${mint.decimals}
Is initialized: ${mint.isInitialized}
Freeze Authority: ${codecFreezeAuthority}

`);

// 3. Manual decoding
const view = new DataView(
  dataBytes.buffer,
  dataBytes.byteOffset,
  dataBytes.byteLength
);

const hasMintAuthority = view.getUint32(0, true) === 1;

let authorityBytes = null;
if (hasMintAuthority) {
  const authorityBytes = dataBytes.slice(4, 36);
}

const supply = view.getBigUint64(36, true);

const decimals = view.getUint8(44);

const readableSupply = Number(supply) / Math.pow(10, decimals);

const isInitialized = view.getUint8(45) === 1;

console.log(`
--- Manual Byte-Level Decode ---
Has Mint Authority: ${hasMintAuthority}
Mint Authority: ${authorityBytes ? authorityBytes : "None"}
Supply (raw): ${supply}
Decimals: ${decimals}
Supply (human readable): ${readableSupply}
Is initialized: ${isInitialized}
`)

// 4. JSON parsed comparison
const parsed = await rpc
  .getAccountInfo(mintAddress, { encoding: "jsonParsed"})
  .send();

console.log("\n--- RPC jsonParsed Result ---");
console.log(JSON.stringify(parsed.value.data.parsed, null, 2));

