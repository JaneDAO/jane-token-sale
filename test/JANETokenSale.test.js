process.env.TESTING = true;

const { ethers } = require('hardhat');
const { expect } = require('chai');

const { parseEther } = ethers.utils;
const deploy = require('../scripts/deploy');

describe('JANETokenSale', function () {
  let owner,
    beneficiary,
    janeEscrow,
    buyer,
    aggregator,
    hedgeyBatchPlanner,
    janeToken,
    janeTokenSale,
    janePerUSD;

  beforeEach(async () => {
    [owner, beneficiary, janeEscrow, buyer, aggregator, hedgeyBatchPlanner] =
      await ethers.getSigners();

    const JaneToken = await ethers.getContractFactory('MockERC20');
    janeToken = await JaneToken.deploy('JANE Token', 'JANE');
    await janeToken.deployed();

    const MockAggregator = await ethers.getContractFactory('MockAggregator');
    const priceFeed = await MockAggregator.deploy();
    await priceFeed.deployed();
    await priceFeed.setLatestPrice(400000000000); // Mocking ETH price at $4000

    const MockBatchPlanner = await ethers.getContractFactory(
      'MockBatchPlanner'
    );
    hedgeyBatchPlanner = await MockBatchPlanner.deploy();
    await hedgeyBatchPlanner.deployed();

    janePerUSD = 267;

    janeTokenSale = await deploy(
      janeToken.address,
      janeEscrow.address,
      priceFeed.address,
      janePerUSD,
      owner.address,
      hedgeyBatchPlanner.address
    );
  });

  describe('buyTokens', () => {
    it('should allow user to buy tokens and tokens should be locked', async () => {
      await janeToken.mint(janeEscrow.address, parseEther('1000000000'));
      await janeToken
        .connect(janeEscrow)
        .approve(janeTokenSale.address, parseEther('1000000000'));

      const buyerBalanceBefore = await janeToken.balanceOf(buyer.address);
      expect(buyerBalanceBefore).to.eq(0);

      const janeEscrowBalanceBefore = await janeToken.balanceOf(
        janeEscrow.address
      );
      const ownerBalanceBefore = await ethers.provider.getBalance(
        owner.address
      );

      const currentPrice = await janeTokenSale.getCurrentEthUsdPrice();
      const expectedAmount = parseEther('1')
        .mul(currentPrice)
        .mul(janePerUSD)
        .mul(parseEther('1'))
        .div('100000000')
        .div(parseEther('1'));

      const tx = await janeTokenSale
        .connect(buyer)
        .buyTokens(buyer.address, { value: parseEther('1') });

      const buyerBalanceAfter = await janeToken.balanceOf(buyer.address);
      expect(buyerBalanceAfter).to.eq(0);

      const janeEscrowBalanceAfter = await janeToken.balanceOf(
        janeEscrow.address
      );
      expect(janeEscrowBalanceAfter).to.eq(
        janeEscrowBalanceBefore.sub(expectedAmount)
      );

      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
      expect(ownerBalanceAfter).to.eq(ownerBalanceBefore.add(parseEther('1')));
    });

    // Buying With Zero Ether
    it('should revert when buying with zero ether', async () => {
      await janeToken.mint(janeEscrow.address, parseEther('1000000000'));
      await janeToken
        .connect(janeEscrow)
        .approve(janeTokenSale.address, parseEther('1000000000'));

      await expect(
        janeTokenSale.connect(buyer).buyTokens(buyer.address, { value: 0 })
      ).to.be.reverted;
    });

    // Over Spending
    it("should revert if user tries to buy more tokens than janeEscrow's allowance", async () => {
      await janeToken.mint(janeEscrow.address, parseEther('1')); // Only minting a small amount
      await janeToken
        .connect(janeEscrow)
        .approve(janeTokenSale.address, parseEther('1'));

      await expect(
        janeTokenSale
          .connect(buyer)
          .buyTokens(buyer.address, { value: parseEther('10') })
      ).to.be.reverted; // Trying to buy a large amount
    });

    // Fallback Function Behavior
    it('should allow buying tokens via fallback', async () => {
      await janeToken.mint(janeEscrow.address, parseEther('1000000000'));
      await janeToken
        .connect(janeEscrow)
        .approve(janeTokenSale.address, parseEther('1000000000'));

      const buyerBalanceBefore = await janeToken.balanceOf(buyer.address);
      expect(buyerBalanceBefore).to.eq(0);

      const janeEscrowBalanceBefore = await janeToken.balanceOf(
        janeEscrow.address
      );
      const ownerBalanceBefore = await ethers.provider.getBalance(
        owner.address
      );

      const currentPrice = await janeTokenSale.getCurrentEthUsdPrice();
      const expectedAmount = parseEther('1')
        .mul(currentPrice)
        .mul(janePerUSD)
        .mul(parseEther('1'))
        .div('100000000')
        .div(parseEther('1'));

      const tx = await buyer.sendTransaction({
        to: janeTokenSale.address,
        value: parseEther('1'),
        gasLimit: 1000000,
      });

      const buyerBalanceAfter = await janeToken.balanceOf(buyer.address);
      expect(buyerBalanceAfter).to.eq(0);

      const janeEscrowBalanceAfter = await janeToken.balanceOf(
        janeEscrow.address
      );
      expect(janeEscrowBalanceAfter).to.eq(
        janeEscrowBalanceBefore.sub(expectedAmount)
      );

      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
      expect(ownerBalanceAfter).to.eq(ownerBalanceBefore.add(parseEther('1')));
    });

    // Insufficient Allowance
    it("should revert when there's insufficient allowance", async () => {
      await janeToken.mint(janeEscrow.address, parseEther('100'));
      await janeToken
        .connect(janeEscrow)
        .approve(janeTokenSale.address, parseEther('10')); // Only approving a small amount

      await expect(
        janeTokenSale
          .connect(buyer)
          .buyTokens(buyer.address, { value: parseEther('10') })
      ).to.be.reverted; // Trying to buy a larger amount
    });
  });

  describe('setJanePerUSD', () => {
    it('should allow owner to set the janePerUSD', async () => {
      await janeTokenSale.setJanePerUSD(parseEther('0.02'));
      const updatedRate = await janeTokenSale.janePerUSD();
      expect(updatedRate).to.eq(parseEther('0.02'));
    });

    it('should not allow non-owner to set the janePerUSD', async () => {
      await expect(
        janeTokenSale.connect(buyer).setJanePerUSD(parseEther('0.02'))
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });

  describe('getCurrentEthUsdPrice', () => {
    it('should correctly fetch the mocked ETH/USD price', async () => {
      const price = await janeTokenSale.getCurrentEthUsdPrice();
      expect(price).to.eq(400000000000);
    });
  });
});
