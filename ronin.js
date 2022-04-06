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

    const code = await provider.getCode(contractAddress);
    //console.log(code);

    const gas = await provider.getGasPrice();
    console.log("Gas Price: " + ethers.utils.formatEther(gas));

    // to be tested
    const restake = await connectedContract.restakeRewards();
    await restake.wait();
    console.log(restake);
    // buildTransaction({'gas': 492874, 'gasPrice': 0, 'nonce': nonce})

  } catch (error) {
    console.error(error);
  }
};

main();
