const { ethers } = require("ethers");
require("dotenv").config();

// Import environment variables
const RPC_URL = process.env.WEB3_NODE_URI;
const ADDRESS = process.env.USER_1_ADDRESS;

// Initialize ethers components
const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

const main = async () =>
{
    const balance = await provider.getBalance(ADDRESS);
    console.log(ethers.utils.formatEther(balance));
}

main();