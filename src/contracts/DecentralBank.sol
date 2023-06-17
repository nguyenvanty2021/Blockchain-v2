pragma solidity ^0.5.0;
import './RWD.sol';
import './Tether.sol';
contract DecentralBank {
    string public name = 'Decentral Bank';
    address public owner;
    Tether public tether;
    RWD public rwd;
    mapping(address => uint) public stakingBalance;
    constructor(RWD _rwd, Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
    }
    // staking function
    function depositTokens(uint _amount) public {
        // Transfer tether tokens to this contract address for staking
        tether.transferFrom(msg.sender, address(this), _amount);
        // Update Staking Balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;
    }
}
