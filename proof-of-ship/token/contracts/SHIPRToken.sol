// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SHIPRToken is ERC20, Ownable {
    event TopBuilderReward(address indexed builder, uint256 amount);

    struct BuilderReward {
        address builder;
        uint256 amount;
    }

    constructor() ERC20("SHIPR Token", "SHIPR") Ownable(msg.sender) {
        _mint(msg.sender, 1_000_000 * 10 ** decimals());
    }

    // Function to distribute rewards to builders with custom amounts
    function distributeTopBuilderRewards(BuilderReward[] calldata rewards) external onlyOwner {
        require(rewards.length > 0, "Empty rewards array not allowed");
        
        uint256 totalReward = 0;
        for (uint256 i = 0; i < rewards.length;) {
            totalReward += rewards[i].amount;
            unchecked {
                ++i;
            }
        }
        
        require(balanceOf(msg.sender) >= totalReward, "Insufficient balance for rewards");

        for (uint256 i = 0; i < rewards.length;) {
            BuilderReward memory reward = rewards[i];
            require(reward.builder != address(0), "Invalid builder address");
            _transfer(msg.sender, reward.builder, reward.amount);
            emit TopBuilderReward(reward.builder, reward.amount);
            unchecked {
                ++i;
            }
        }
    }
}
