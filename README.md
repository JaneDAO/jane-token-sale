# JANE Token Sale Contract

## Deployments

### Ethereum Mainnet

### Goerli Testnet
* `0x2Fc5cC67cc21F5453B758b32AAA2C40b98b18862` [etherscan](https://goerli.etherscan.io/address/0x2Fc5cC67cc21F5453B758b32AAA2C40b98b18862)

## **Web Integration Guide**

### **Integration Steps**

1. **Setting Up Web3**:
    - Ensure your web application integrates with `web3.js` library or `ethers.js`. These libraries allow your web application to interact with Ethereum blockchain.
    ```javascript
    const Web3 = require('web3');
    const web3 = new Web3(Web3.givenProvider || "YOUR_INFURA_LINK");
    ```

2. **Integrating JANETokenSale Contract**:
    - Connect to the deployed `JANETokenSale` contract.
    ```javascript
    const janetokenSaleABI = [/* ABI Array Here */];
    const contractAddress = '<Deployment Address Here>';
    const janeTokenSale = new web3.eth.Contract(janetokenSaleABI, contractAddress);
    ```

3. **Getting Estimated Tokens for Ether**:
    - Provide a function to estimate tokens for a given Ether amount.
    ```javascript
    async function getEstimatedTokensForEth(amountInEth) {
        const currentPrice = BigInt(await janeTokenSale.methods.getCurrentEthUsdPrice().call());
        const weiAmount = BigInt(web3.utils.toWei(amountInEth.toString(), 'ether'));
        const janePerUSD = BigInt(await janeTokenSale.methods.janePerUSD().call());

        const estimatedTokens = (weiAmount * currentPrice * janePerUSD) / (10n ** 18n);
        return estimatedTokens.toString();
    }
    ```

4. **Purchase Function**:
    - Implement a function allowing users to purchase tokens.
    ```javascript
    async function purchaseTokens(amountInEth) {
        const weiAmount = BigInt(web3.utils.toWei(amountInEth.toString(), 'ether'));
        const tx = await janeTokenSale.methods.buyTokens(web3.eth.defaultAccount).send({ value: weiAmount.toString() });
        console.log("Transaction:", tx);
    }
    ```

### **Purchasing with a Self-Custody Wallet**

In addition to the usual purchase methods, users can send Ether directly to the `JANETokenSale` contract.

#### **Explanation**:

1. **Direct ETH Transfer**: Users can send an Ether transaction directly to the `JANETokenSale` contract address `<Deployment Address Here>`.

2. **Fallback Function**: This method internally invokes the `buyTokens` function and locks equivalent tokens for the sender's address.

3. **Token Beneficiary**: Tokens will be locked for the address from which Ether is sent. It's vital to send from a personal, self-custody wallet.

#### ⚠️ **Warning**:

**Never send Ether directly from an exchange's address**. Always use a personal, self-custody wallet. If sent from an exchange, the tokens will be locked for the exchange's address, and you might lose access to them.

### **Testing**:

Before going live, thoroughly test the website on Ethereum testnets like Rinkeby, Ropsten, or Kovan. Ensure all functions work correctly and all token calculations are accurate.

### **Security Considerations**:

- Ensure your website is secure and uses https only.
- Always inform users to use personal, self-custody wallets like MetaMask, and never from exchange addresses.
- Regularly audit the website code.
- Educate users about phishing attacks and only provide official website links.


## Notes
* Chainlink price feeds: https://docs.chain.link/data-feeds/price-feeds/addresses
* Hedgey deployments: https://hedgey.gitbook.io/hedgey-community-docs/for-developers/resources/deployments/voting-token-lockup-plans

## TODO

## Contributing
1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
