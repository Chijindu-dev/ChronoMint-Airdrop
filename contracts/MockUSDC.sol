// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @dev ERC20 token with 6 decimals for testing presale payments
 * Mintable by owner to provide test funds
 */
contract MockUSDC is ERC20, Ownable {
    constructor() ERC20("Mock USDC", "USDC") Ownable(msg.sender) {
        // Mint initial supply to deployer for testing (1 million USDC)
        _mint(msg.sender, 1_000_000 * 10 ** 6);
    }

    /**
     * @dev Returns 6 decimals (standard for USDC)
     */
    function decimals() public pure override returns (uint8) {
        return 6;
    }

    /**
     * @dev Mint tokens for testing purposes
     * @param to Address to receive tokens
     * @param amount Amount of tokens to mint (in base units)
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
