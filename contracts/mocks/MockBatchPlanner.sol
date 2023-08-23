// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MockBatchPlanner {
    event BatchLockingPlanCreated(
        address locker,
        address token,
        uint256 totalAmount
    );

    function batchLockingPlans(
        address locker,
        address token,
        uint256 totalAmount,
        Plan[] calldata /* plans */,
        uint256 /* period */,
        uint8 /* mintType */
    ) external {
        emit BatchLockingPlanCreated(locker, token, totalAmount);
    }

    struct Plan {
        address recipient;
        uint256 amount;
        uint256 start;
        uint256 cliff;
        uint256 rate;
    }
}
