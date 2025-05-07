// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CeloWordGame {
    mapping(address => uint256) private _scores;
    
    event ScoreUpdated(address indexed player, uint256 score);

    function submitScore(uint256 score) external {
        require(score > 0, "Score must be positive");
        if(score > _scores[msg.sender]) {
            _scores[msg.sender] = score;
            emit ScoreUpdated(msg.sender, score);
        }
    }

    function getScore(address player) external view returns (uint256) {
        return _scores[player];
    }
}