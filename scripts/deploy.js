// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers, upgrades } = require('hardhat');
const { settings } = require('./utils');

async function deploy(
  janeToken,
  janeEscrow,
  priceFeed,
  janePerUSD,
  owner,
  hedgeyBatchPlanner
) {
  // Deploying
  const [deployer] = await ethers.getSigners();
  console.log(`Deployer account is ${deployer.address}`);

  console.log('Deploying JANETokenSale...');
  const JANETokenSale = await ethers.getContractFactory('JANETokenSale');
  const instance = await JANETokenSale.deploy(
    janeToken,
    janeEscrow,
    priceFeed,
    janePerUSD,
    owner,
    hedgeyBatchPlanner
  );
  await instance.deployed();

  console.log(
    `JANETokenSale deployed to ${instance.address}. janeToken ${janeToken} janeEscrow ${janeEscrow} priceFeed ${priceFeed} janePerUSD ${janePerUSD} owner ${owner} hedgeyBatchPlanner ${hedgeyBatchPlanner}`
  );

  return instance;
}

if (!process.env.TESTING) {
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  const [name, symbol, firstHolder] = settings([
    'JANE_TOKEN',
    'JANE_ESCROW',
    'PRICE_FEED',
    'JANE_PER_USD',
    'OWNER',
    'HEDGEY_BATCH_PLANNER',
  ]);
  deploy(
    janeToken,
    janeEscrow,
    priceFeed,
    janePerUSD,
    owner,
    hedgeyBatchPlanner
  ).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = deploy;
