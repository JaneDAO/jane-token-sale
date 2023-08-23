// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract MockERC20 is ERC20, Ownable {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

    // Function to mint tokens
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    // Function to burn tokens
    function burn(address from, uint256 amount) external onlyOwner {
        _burn(from, amount);
    }
}
