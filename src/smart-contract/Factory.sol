pragma solidity ^0.4.21;

import './Pay2Play.sol';
import './ERC20.sol';

contract Factory
{
    address[] public contracts;

    function Factory() public
    {
      deployRegistrarContract();
    }

    function deployTokenContract() returns (address)
    {
        address tokenContract = new PlayToken();
        contracts.push(tokenContract);
        return tokenContract;
    }

    function deployRegistrarContract() returns (address)
    {
        address registrarContract = deployRegistrarContract();
        address tokenContract = new Registrar(registrarContract);
        contracts.push(tokenContract);
        return tokenContract;
    }

    function getContract(uint index) returns (address)
    {
        return contracts[index];
    }
}
