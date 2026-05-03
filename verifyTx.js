const fetch = require('node-fetch');

async function check(txid) {
  const url = `https://blockstream.info/testnet/api/tx/${txid}/status`;
  const r = await fetch(url);
  if (r.status === 200) {
    const j = await r.json();
    console.log('status:', j);
    return j;
  } else {
    console.log('not found / error', r.status);
    return null;
  }
}

const txid = process.argv[2];
if (!txid) {
  console.log('usage: node verifyTx.js <txid>');
  process.exit(1);
}
check(txid);
