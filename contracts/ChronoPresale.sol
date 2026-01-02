// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ChronoPresale is Ownable, ReentrancyGuard {
    IERC20 public token; // CHRONO token
    IERC20 public paymentToken; // Payment token (USDC)
    uint256 public rate = 100; // 1 USDC = 100 CHRONO
    uint256 public totalRaised; // Total USDC raised
    uint256 public hardCap = 10000 * 10 ** 6; // Max 10,000 USDC (6 decimals)

    mapping(address => uint256) public contributions;

    event TokensPurchased(address indexed buyer, uint256 amount, uint256 cost);

    constructor(address _token, address _paymentToken) Ownable(msg.sender) {
        token = IERC20(_token);
        paymentToken = IERC20(_paymentToken);
    }

    /**
     * @dev Purchase CHRONO tokens with payment token (USDC)
     * @param _amount Amount of payment token to spend (in base units, e.g., 1 USDC = 1000000)
     */
    function buyTokens(uint256 _amount) public nonReentrant {
        require(_amount > 0, "Amount must be > 0");
        require(totalRaised + _amount <= hardCap, "Hardcap reached");

        uint256 tokenAmount = (_amount * rate * 10 ** 18) / 10 ** 6; // Adjust for decimals difference
        require(
            token.balanceOf(address(this)) >= tokenAmount,
            "Insufficient tokens in contract"
        );

        // Transfer payment token from buyer to this contract
        require(
            paymentToken.transferFrom(msg.sender, address(this), _amount),
            "Payment transfer failed"
        );

        contributions[msg.sender] += _amount;
        totalRaised += _amount;

        // Transfer CHRONO tokens to buyer
        require(
            token.transfer(msg.sender, tokenAmount),
            "Token transfer failed"
        );
        emit TokensPurchased(msg.sender, tokenAmount, _amount);
    }

    /**
     * @dev Withdraw collected payment tokens (owner only)
     */
    function withdrawPayments() public onlyOwner {
        uint256 balance = paymentToken.balanceOf(address(this));
        require(balance > 0, "No payments to withdraw");
        require(paymentToken.transfer(owner(), balance), "Withdrawal failed");
    }

    function setRate(uint256 _rate) public onlyOwner {
        rate = _rate;
    }
}
