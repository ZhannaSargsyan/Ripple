const xrpl = require("xrpl");

const wallet = xrpl.Wallet.fromSeed("sEdSxHjYT5m1P7jiWgFBAiWaBgtuRuv");
console.log(wallet.address);

async function main() {
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
  await client.connect();

  const prepared = await client.autofill({
    TransactionType: "Payment",
    Account: wallet.address,
    Amount: xrpl.xrpToDrops("1"),
    Destination: "r3UNctgs4bwpQx1nw4EE57C4tkexidVjSc",
  });

  const max_ledger = prepared.LastLedgerSequence;

  console.log("Prepared Transaction instructions", prepared);
  console.log("Transaction cose", xrpl.dropsToXrp(prepared.Fee), "XRP");
  console.log("Transaction expires after ledger:", max_ledger);

  const signed = wallet.sign(prepared);
  console.log("Hash of transaction", signed.hash);
  console.log("Signed blob", signed.tx_blob);

  const tx = await client.submitAndWait(signed.tx_blob);

  console.log("Transaction results", tx.result.meta.TransactionResult);
  console.log(
    "balance changes",
    JSON.stringify(xrpl.getBalanceChanges(tx.result.meta), null, 2)
  );

  // await client.disconnect();
}
main();
