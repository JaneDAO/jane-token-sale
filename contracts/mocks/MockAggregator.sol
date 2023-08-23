// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MockAggregator {
    int256 private price;

    function setLatestPrice(int256 _price) external {
        price = _price;
    }

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (
            1, // mock roundId
            price, // mock latest price
            block.timestamp,
            block.timestamp,
            1
        );
    }
}
