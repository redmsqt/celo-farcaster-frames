// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SHIPRToken is ERC20, Ownable {
     event TopBuilderReward(address indexed builder, uint256 amount);

    constructor() ERC20("SHIPR Token", "SHIPR") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    // Function to distribute rewards to top builders
    function distributeTopBuilderRewards(address[] calldata builders) external onlyOwner {
        uint256 len = builders.length;
        require(len <= 10, "Maximum 10 builders allowed");
        
        uint256[10] memory rewards = [
            uint256(500 * 10**18),  // 1st place: 500 tokens
            uint256(450 * 10**18),  // 2nd place: 450 tokens
            uint256(400 * 10**18),  // 3rd place: 400 tokens
            uint256(350 * 10**18),  // 4th place: 350 tokens
            uint256(300 * 10**18),  // 5th place: 300 tokens
            uint256(250 * 10**18),  // 6th place: 250 tokens
            uint256(200 * 10**18),  // 7th place: 200 tokens
            uint256(150 * 10**18),  // 8th place: 150 tokens
            uint256(100 * 10**18),  // 9th place: 100 tokens
            uint256(50 * 10**18)    // 10th place: 50 tokens
        ];

        uint256 totalReward = 2750 * 10**18;
        require(balanceOf(msg.sender) >= totalReward, "Insufficient balance for rewards");

        for (uint256 i = 0; i < len;) {
            address builder = builders[i];
            require(builder != address(0), "Invalid builder address");
            _transfer(msg.sender, builder, rewards[i]);
            emit TopBuilderReward(builder, rewards[i]);
            unchecked {
                ++i;
            }
        }
    }
}
