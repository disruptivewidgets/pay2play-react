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

  struct struct_Player
  {
     uint slot;
     bool exists;
   }

  mapping (address => struct_Player) players_SideA;
  mapping (address => struct_Player) players_SideB;

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

  // SIDE A
  function join_SideA(uint slot) payable public
  {
    /* if (msg.value < minPrice) revert(); */

    uint start = numberOfParticipants - 1;
    uint finish = 2 * (numberOfParticipants - 1);

    // can only join periphery
    if (slot < start && slot > finish) revert();

    if (containsPlayer_SideA(msg.sender)) revert();

    seats_SideA[slot] = msg.sender;
    addPlayer_SideA(msg.sender, slot);
  }

  function addPlayer_SideA(address _player, uint _slot) private
  {
    if(!players_SideA[_player].exists)
    {
      players_SideA[_player].exists = true;
    }

    players_SideA[_player].slot = _slot;
  }

  function containsPlayer_SideA(address _player) returns (bool)
  {
    return players_SideA[_player].exists;
  }

  function getPlayerSlot_SideA(address _player) constant public returns (uint)
  {
    return players_SideA[_player].slot;
  }

  function promotePlayer_SideA(address _player) public
  {
    uint slot = getPlayerSlot_SideA(_player);
    if (slot % 2 == 0)
    {
      slot = (slot - 2)/2;
    }
    else
    {
      slot = (slot - 1)/2;
    }

    seats_SideA[slot] = _player;
    players_SideA[_player].slot = slot;
  }

  // SIDE B
  function join_SideB(uint slot) payable public
  {
    /* if (msg.value < minPrice) revert(); */

    uint start = numberOfParticipants - 1;
    uint finish = 2 * (numberOfParticipants - 1);

    // can only join periphery
    if (slot < start && slot > finish) revert();

    if (containsPlayer_SideB(msg.sender)) revert();

    seats_SideB[slot] = msg.sender;
    addPlayer_SideB(msg.sender, slot);
  }

  function addPlayer_SideB(address _player, uint _slot) private
  {
    if(!players_SideB[_player].exists)
    {
      players_SideB[_player].exists = true;
    }

    players_SideB[_player].slot = _slot;
  }

  function containsPlayer_SideB(address _player) returns (bool)
  {
    return players_SideB[_player].exists;
  }

  function getPlayerSlot_SideB(address _player) constant public returns (uint)
  {
    return players_SideB[_player].slot;
  }

  function promotePlayer_SideB(address _player) public
  {
    uint slot = getPlayerSlot_SideB(_player);
    if (slot % 2 == 0)
    {
      slot = (slot - 2)/2;
    }
    else
    {
      slot = (slot - 1)/2;
    }

    seats_SideB[slot] = _player;
    players_SideB[_player].slot = slot;
  }
}
