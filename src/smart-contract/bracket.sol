/**
 * @title Pay2Play/Bracket Smart Contract
 * @url http://pay2play.io
 * @version 1.0.0
 */

pragma solidity ^0.4.21;

contract Tournament
{
  bool public active;
  uint public creationDate;
  uint public numberOfParticipants;

  uint constant minPrice = 0.01 ether;

  address public winner;

  address[] seats_SideA;
  address[] seats_SideB;

  struct range { uint start; uint finish; }

  constructor(uint _numberOfParticipants) public
  {
    active = true;
    creationDate = now;
    numberOfParticipants = _numberOfParticipants;

    activate();
  }

  // version 2
  function activate() public
  {
    uint i = 0;

    for (i = 0; i < 2 * numberOfParticipants - 1; i++)
    {
      seats_SideA.push(address(0));
    }

    for (i = 0; i < 2 * numberOfParticipants - 1; i++)
    {
      seats_SideB.push(address(0));
    }
  }

  function getSeats_SideA() constant public returns (address[])
  {
      return (seats_SideA);
  }

  function getSeats_SideB() constant public returns (address[])
  {
      return (seats_SideB);
  }

  function join_SideA(uint slot) payable public
  {
    /* if (msg.value < minPrice) revert(); */

    uint start = numberOfParticipants - 1;
    uint finish = 2 * (numberOfParticipants - 1);

    // can only join periphery
    if (slot < start && slot > finish) revert();

    // can only join once
    for (uint i = start; i <= finish; i++)
    {
      if (seats_SideA[i] == msg.sender)
      {
        revert();
      }
    }

    seats_SideA[slot] == msg.sender;
  }

  function join_SideB(uint slot) payable public
  {
    /* if (msg.value < minPrice) revert(); */

    uint start = numberOfParticipants - 1;
    uint finish = 2 * (numberOfParticipants - 1);

    // can only join periphery
    if (slot < start && slot > finish) revert();

    // can only join once
    for (uint i = start; i <= finish; i++)
    {
      if (seats_SideB[i] == msg.sender)
      {
        revert();
      }
    }

    seats_SideB[slot] == msg.sender;
  }
}
