import { createSolanaRpc, devnet, address } from "@solana/kit";

const rpc = createSolanaRpc(devnet("https://api.devnet.solana.com"));
const addressInput = document.getElementById("addressInput");
const fetchBtn = document.getElementById("fetchBtn");
const resultsDiv = document.getElementById("results");
const errorDiv = document.getElementById("error");
const loadingDiv = document.getElementById("loading");

fetchBtn.addEventListener("click", async () => {
  errorDiv.textContent = "";
  resultsDiv.innerHTML = "";
  loadingDiv.textContent = "Fetching...";

  try {
    const targetAddress = address(addressInput.value.trim());

    // Fetch balance
    const { value: balanceInLamports } = await rpc
      .getBalance(targetAddress)
      .send();

    const balanceInSol = Number(balanceInLamports) / 1_000_000_000;

    // Fetch recent transactions
    const signatures = await rpc
      .getSignaturesForAddress(targetAddress, { limit: 5 })
      .send();

    // Render balance
    let markup = `<div class="balance">${balanceInSol} SOL</div>`;
    markup += `<h3?Recent transactions</h3>`;

    // Render transactions
    for (const tx of signatures) {
      const time = tx.blockTime
        ? new Date(Number(tx.blockTime) * 1000).toLocaleString()
        : "unknown";
      const statusClass = tx.err ? "status failed" : "status";
      const statusText = tx.err ? "Failed" : "Success";

      markup += `
        <div class="tx">
          <div><strong>Signature:</strong> ${tx.signature}</div>
          <div><strong>Slot:</strong> ${tx.slot}</div>
          <div><strong>Time:</strong> ${time}</div>
          <div class="${statusClass}"><strong>Status:</strong> ${statusText}</div>
        </div>
      `;
    }

    resultsDiv.innerHTML = markup;
  } catch (err) {
    errorDiv.textContent = `Error: ${err.message}`;
  } finally {
    loadingDiv.textContent = "";
  }
});
