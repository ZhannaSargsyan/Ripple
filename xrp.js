/*
  The basic building blocks of XRP Ledger-based applications.
  How to connect to the XRP Ledger using xrpl.js.
  How to get an account on the Testnet using xrpl.js.
  How to use the xrpl.js library to look up information about an account on the XRP Ledger.
  How to put these steps together to create a JavaScript app.
*/

const xrpl = require("xrpl");

async function main() {
  const SERVER_URL = "wss://s.altnet.rippletest.net:51233";
  const client = new xrpl.Client(SERVER_URL);

  await client.connect();

  const fund_wallet = await client.fundWallet();
  const test_wallet = fund_wallet.wallet;

  console.log(fund_wallet);

  const response = await client.request({
    command: "account_info",
    account: test_wallet.address,
    ledger_index: "validated",
  });

  console.log(response);

  client.request({
    command: "subscribe",
    streams: ["ledger"],
  });

  client.on("ledgerClosed", async (ledger) => {
    console.log(
      `Ledger #${ledger.ledger_index} validated with ${ledger.txn_count} transactions`
    );
  });

  // await client.disconnect();
}

main();
