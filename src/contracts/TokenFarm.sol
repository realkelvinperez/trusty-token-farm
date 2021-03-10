pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "Dapp Token Farm";
    address public owner;
    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public stakers;
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;


    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    // 1. Stake Token (Deposit)
    function stakeTokens(uint _amount) public {
        require(_amount > 0, "amount cannot be 0");
        // Transfer mDai to this contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);

        // Update Staking Amount
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // Add Users To stakers array *only* if they haven't staked already
        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        // Update Staking Status
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    // Unstacking Tokens (Withdraw)

    function unstakeToken() public {
        uint balance = stakingBalance[msg.sender];
    }

    function issueToken() public {
        // Only owner call call this function
        require(msg.sender == owner, "caller must be the owner");

        // Issue Tokens to all stakers
        for (uint i = 0; i < stakers.length; i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0){
                dappToken.transfer(recipient, balance);
            }
        }
    }

    // Issuing Tokens

}
