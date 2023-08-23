// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol';

interface IBatchPlanner {
    struct Plan {
        address recipient;
        uint256 amount;
        uint256 start;
        uint256 cliff;
        uint256 rate;
    }

    function batchLockingPlans(
        address locker,
        address token,
        uint256 totalAmount,
        Plan[] calldata plans,
        uint256 period,
        uint8 mintType
    ) external;
}

contract JANETokenSale is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    IERC20 public janeToken;
    AggregatorV3Interface public priceFeed;
    address public janeEscrow;
    uint256 public janePerUSD;
    address public hedgeyBatchPlanner;
    uint256 public constant LOCKUP_PERIOD = 31536000; // 1 year in seconds

    constructor(
        address _janeToken,
        address _janeEscrow,
        address _priceFeed,
        uint256 _janePerUSD,
        address _owner,
        address _hedgeyBatchPlanner
    ) {
        janeToken = IERC20(_janeToken);
        priceFeed = AggregatorV3Interface(_priceFeed);
        janePerUSD = _janePerUSD;
        transferOwnership(_owner);
        janeEscrow = _janeEscrow;
        hedgeyBatchPlanner = _hedgeyBatchPlanner;
    }

    function getCurrentEthUsdPrice() public view returns (int) {
        (, int price, , , ) = priceFeed.latestRoundData();
        return price;
    }

    function buyTokens(address beneficiary) external payable nonReentrant {
        require(
            beneficiary != address(0),
            'Beneficiary address should be valid'
        );
        require(msg.value > 0, 'Ether sent should be greater than 0');

        int currentPrice = getCurrentEthUsdPrice();
        uint256 janeAmount = janePerUSD
        /* .mul(10 ** 18) */ // technically this is the math, but it cancels due to the division at the bottom
            .mul(uint256(currentPrice))
            .mul(msg.value)
            .div(10 ** 8); // this should explicitly be above the prvious line to show steps, but was moved down to improve accuracy
        /* .div(10 ** 18); */

        require(
            janeToken.allowance(janeEscrow, address(this)) >= janeAmount,
            'Token allowance is insufficient'
        );
        janeToken.safeTransferFrom(janeEscrow, address(this), janeAmount);

        // Lock the tokens using BatchPlanner's batchLockingPlans function
        IBatchPlanner.Plan[] memory plans = new IBatchPlanner.Plan[](1);
        plans[0] = IBatchPlanner.Plan({
            recipient: beneficiary,
            amount: janeAmount,
            start: block.timestamp,
            cliff: 0, // No cliff, can be adjusted
            rate: janeAmount.div(LOCKUP_PERIOD)
        });

        SafeERC20.safeIncreaseAllowance(
            janeToken,
            hedgeyBatchPlanner,
            janeAmount
        );
        IBatchPlanner(hedgeyBatchPlanner).batchLockingPlans(
            hedgeyBatchPlanner,
            address(janeToken),
            janeAmount,
            plans,
            LOCKUP_PERIOD,
            1 // mintType, assuming 1 for now
        );

        // Transfer Ether to the owner
        payable(owner()).transfer(msg.value);
    }

    // Called when receiving Ether
    receive() external payable {
        this.buyTokens{value: msg.value}(msg.sender);
    }

    // Fallback function
    fallback() external payable {
        this.buyTokens{value: msg.value}(msg.sender);
    }

    function setJanePerUSD(uint256 newJanePerUSD) external onlyOwner {
        require(newJanePerUSD > 0, 'Rate should be greater than zero');
        janePerUSD = newJanePerUSD;
        emit JanePerUSDChanged(newJanePerUSD);
    }

    event JanePerUSDChanged(uint256 newJanePerUSD);
}
