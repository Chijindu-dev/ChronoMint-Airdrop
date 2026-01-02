// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ChronoAirdrop is Ownable, ReentrancyGuard {
    IERC20 public token;
    uint256 public constant AIRDROP_AMOUNT = 1250 * 10**18;
    
    mapping(address => bool) public isEligible;
    mapping(address => bool) public hasClaimed;

    event TokensClaimed(address indexed claimer, uint256 amount);

    constructor(address _token) Ownable(msg.sender) {
        token = IERC20(_token);
    }

    function setEligibility(address[] calldata accounts, bool status) external onlyOwner {
        for(uint i = 0; i < accounts.length; i++) {
            isEligible[accounts[i]] = status;
        }
    }

    function claim() external nonReentrant {
        require(isEligible[msg.sender], "Not eligible for airdrop");
        require(!hasClaimed[msg.sender], "Airdrop already claimed");
        require(token.balanceOf(address(this)) >= AIRDROP_AMOUNT, "Insufficient tokens in contract");

        hasClaimed[msg.sender] = true;
        token.transfer(msg.sender, AIRDROP_AMOUNT);
        
        emit TokensClaimed(msg.sender, AIRDROP_AMOUNT);
    }

    function emergencyWithdraw() external onlyOwner {
        token.transfer(owner(), token.balanceOf(address(this)));
    }
}
