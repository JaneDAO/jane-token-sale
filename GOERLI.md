## Deployment Notes

```
$ DEPLOY=1 npx hardhat run scripts/deploy.js --network goerli
Deployer account is 0xC1151bb68d67dD5CD992b8dB8e7221588F79F617
Deploying JANETokenSale...
JANETokenSale deployed to 0x2Fc5cC67cc21F5453B758b32AAA2C40b98b18862. janeToken 0x6A4ec3EEE5131163f457A26cb4Ed78ce23432b63 janeEscrow 0x6e35D16AeF101d8c1167EE83Ea7f3A90c91c898d priceFeed 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e janePerUSD 266 owner 0xCDD5EeEF20923c927EA3BFd7274088f64d3a31BD hedgeyBatchPlanner 0x3Ef93dDE3F8e5dA878E99d7125d1C7434FB07c54 hedgeyVotingTokenLockUpPlan 0x2cE4DC254a4B48824e084791147Ff7220F1A08a7
```

Verification
---
```
$ VERIFY=1 npx hardhat verify --constructor-args ./scripts/verify-params.js --network goerli 0x2Fc5cC67cc21F5453B758b32AAA2C40b98b18862
Nothing to compile
Successfully submitted source code for contract
contracts/JANETokenSale.sol:JANETokenSale at 0x2Fc5cC67cc21F5453B758b32AAA2C40b98b18862
for verification on the block explorer. Waiting for verification result...

Successfully verified contract JANETokenSale on Etherscan.
https://goerli.etherscan.io/address/0x2Fc5cC67cc21F5453B758b32AAA2C40b98b18862#code
```