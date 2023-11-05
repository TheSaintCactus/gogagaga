// worker.js
import TronWeb from "tronweb";
const HttpProvider = TronWeb.providers.HttpProvider;
console.log("worker started");
// eslint-disable-next-line
self.onmessage = function (e) {
  const suffix = e.data;

  const FULL_NODE_URL = "https://nile.trongrid.io";
  const SOLIDITY_NODE_URL = "https://nile.trongrid.io";
  const EVENT_SERVER_URL = "https://nile.trongrid.io";

  const tronWeb = new TronWeb(
    new HttpProvider(FULL_NODE_URL),
    new HttpProvider(SOLIDITY_NODE_URL),
    EVENT_SERVER_URL
  );

  // Генерируйте кошелек и отправляйте результат обратно в основной поток
  const generateAccount = async () => {
    const newAcc = await tronWeb.createAccount();
    const suffixArr = suffix.split(" ");

    for (let i = 0; i < suffixArr.length; i++) {
      const suffix = suffixArr[i];
      if (newAcc?.address.base58.toLowerCase().endsWith(suffix.toLowerCase())) {
        console.log("FOUND", newAcc?.address.base58, suffix);
        postMessage(newAcc);
        return;
      }
    }

    console.log("NOT FOUND", newAcc?.address.base58, suffixArr);

    setTimeout(() => {
      generateAccount();
    }, 10);
  };
  generateAccount();
};
