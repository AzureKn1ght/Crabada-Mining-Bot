const { ethers } = require("ethers");
require("dotenv").config();

// Import environment variables
const RPC_URL = process.env.RONIN_RPC;
const WALLET_ADDRESS = process.env.USER_ADDRESS;
const USER_AGENT = process.env.USER_AGENT;
const PRIV_KEY = process.env.USER_PRIVATE_KEY;

// Initialize ethers components
const provider = new ethers.getDefaultProvider(
  RPC_URL,
  (request_kwargs = {
    headers: { "content-type": "application/json", "user-agent": USER_AGENT },
  })
);

const stakingABI = [
  "function restakeRewards()",
  "function claimPendingRewards()",
  "function unstakeAll()",
];

const contractAddress = "0x05b0bb3c1c320b280501b86706c3551995bc8571";
const contract = new ethers.Contract(contractAddress, stakingABI, provider);
const wallet = new ethers.Wallet(PRIV_KEY, provider);
const connectedContract = contract.connect(wallet);

const main = async () => {
  try {
    // log ronin balance
    const balance = await provider.getBalance(WALLET_ADDRESS);
    console.log("RON Balance: " + ethers.utils.formatEther(balance));

    // get current gas price
    const gas = await provider.getGasPrice();
    console.log("Gas Price: " + ethers.utils.formatEther(gas));

    // first restake on launch
    const successful = await restake();

    // restake successful, set schedule
    if (successful) {
      console.log("Restake Done!");
    }
  } catch (error) {
    console.error(error);
  }
};

const restake = async () => {
  try {
    const randomGas = 400000 + (Math.random() * (99999 - 10000) + 10000);
    const overrideOptions = {
      gasLimit: Math.floor(randomGas),
    };

    // to be tested
    const restake = await connectedContract.restakeRewards(overrideOptions);
    const receipt = await restake.wait();

    if (receipt) {
      console.log("Restake successful");
      console.log(restake);
      console.log(receipt);

      return true;
    }
  } catch (error) {
    console.error(error);
    return false;
  }

  return false;
};

main();
