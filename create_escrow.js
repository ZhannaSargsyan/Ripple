"use strict";

if (typeof module !== "undefined") {
  var xrpl = require("xrpl");
}

const cc = require("five-bells-condition");
const crypto = require("crypto");

const main = async () => {
  try {
    const preimageData = crypto.randomBytes(32);
    const myFullfilment = new cc.PreimageSha256();
    myFullfilment.setPreimage(preimageData);
    const conditonHex = myFullfilment
      .getConditionBinary()
      .toString("hex")
      .toUpperCase();
    console.log("Condition:", conditonHex);
    console.log(
      "Fulfillment:",
      myFullfilment.serializeBinary().toString("hex").toUpperCase()
    );

    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    await client.connect();

    const wallet = xrpl.Wallet.fromSeed("sEdSxHjYT5m1P7jiWgFBAiWaBgtuRuv");
    console.log(wallet.address);

    let finishAfter = new Date(new Date().getTime() / 1000 + 120); // 2 min
    finishAfter = new Date(finishAfter * 1000);

    console.log("This escrow will finish after:", finishAfter);

    const escrowCreateTransaction = {
      TransactionType: "EscrowCreate",
      Account: wallet.address,
      Destination: wallet.address,
      Amount: "6000000",
      DestinationTag: 2023,
      Condition: conditonHex,
      Fee: "12",
      FinishAfter: xrpl.isoTimeToRippleTime(finishAfter.toISOString()),
    };

    xrpl.validate(escrowCreateTransaction);

    console.log(
      "Signing and submitting the transaction:",
      JSON.stringify(escrowCreateTransaction, null, "\t"),
      "\n"
    );
    const response = await client.submitAndWait(escrowCreateTransaction, {
      wallet,
    });
    console.log(`Sequence number: ${response.result.Sequence}`);
    console.log(
      `Finished submitting! ${JSON.stringify(response.result, null, "\t")}`
    );

    // await client.disconnect();
  } catch (error) {
    console.log(error);
  }
};

main();
