require("@nomicfoundation/hardhat-toolbox");

const config = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};

if(process.env.DEPLOY || process.env.VERIFY) {
  require('dotenv').config();
  const INFURA_API_KEY = process.env['INFURA_API_KEY'];
  const MNEMONIC = process.env['MNEMONIC'];
  config.networks = {
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
      accounts: {
        mnemonic: MNEMONIC
      }
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: {
        mnemonic: MNEMONIC
      },
      gasPrice: 18e9
    }
  };

  const ETHERSCAN_API_KEY = process.env['ETHERSCAN_API_KEY'];
  config.etherscan = {
    apiKey: {
      goerli: ETHERSCAN_API_KEY,
      mainnet: ETHERSCAN_API_KEY
    }
  };
}


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = config;
