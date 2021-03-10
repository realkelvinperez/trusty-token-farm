pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

// Step 1: Deploy DAI
// Step 2: Deploy DAPP
// Step 3: Deploy TokenFarm

contract TokenFarm {
    string public name = "Dapp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;

    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
    }
}
