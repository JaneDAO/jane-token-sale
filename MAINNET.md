## Deployment Notes

```
$ DEPLOY=1 npx hardhat run scripts/deploy.js --network mainnet
Deployer account is 0x122B6caf3422a9e4D2D85A48D78Bb4b3D5748239
Deploying JANETokenSale...
JANETokenSale deployed to 0x8314CAC2c632C7383ABE3068dEEa1E9D79A09794. janeToken 0x157a0Adbc19Bedf5C7B2E1f14d71F781267E6821 janeEscrow 0xCDD5EeEF20923c927EA3BFd7274088f64d3a31BD priceFeed 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419 janePerUSD 266 owner 0xCDD5EeEF20923c927EA3BFd7274088f64d3a31BD hedgeyBatchPlanner 0x3466EB008EDD8d5052446293D1a7D212cb65C646 hedgeyVotingTokenLockUpPlan 0x73cD8626b3cD47B009E68380720CFE6679A3Ec3D
```

Verification
---
```
$ VERIFY=1 npx hardhat verify --constructor-args ./scripts/verify-params.js --network mainnet 0x8314CAC2c632C7383ABE3068dEEa1E9D79A09794
Nothing to compile
Successfully submitted source code for contract
contracts/JANETokenSale.sol:JANETokenSale at 0x8314CAC2c632C7383ABE3068dEEa1E9D79A09794
for verification on the block explorer. Waiting for verification result...

Successfully verified contract JANETokenSale on Etherscan.
https://etherscan.io/address/0x8314CAC2c632C7383ABE3068dEEa1E9D79A09794#code
```
