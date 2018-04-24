/**
 * @title Pay2Play/Bracket Smart Contract
 * @url http://pay2play.io
 * @version 1.0.0
 */

pragma solidity ^0.4.21;

/* contract Match
{
  struct match
  {
      address[] participants;
      uint createdAt;
      uint amount;
      address winner;
  }
} */

// 1, 2, 3,  4,  5
// 2, 4, 8, 16, 32

// calculate count of matches on side A

// calculate count of matches on side B

// find height log_2(n)

// number of nodes pow(2,n) - 1

// number of nodes in a tree = n - 1

contract Tournament
{
  bool public active;
  uint public creationDate;
  uint public numberOfParticipants;

  address public winner;

  address[2][] games_SideA;
  address[2][] games_SideB;

  address[] winners_SideA;
  address[] winners_SideB;

  struct range { uint start; uint finish; }

  constructor(uint _numberOfParticipants) public
  {
    active = true;
    creationDate = now;
    numberOfParticipants = _numberOfParticipants;

    activate();
  }

  function activate() public
  {
    uint i = 0;

    for (i = 0; i < numberOfParticipants - 1; i++)
    {
      games_SideA.push([address(0), address(0)]);
      winners_SideA.push(address(0));
    }

    for (i = 0; i < numberOfParticipants - 1; i++)
    {
      games_SideB.push([address(0), address(0)]);
      winners_SideB.push(address(0));
    }
  }

  event Game_SideA_Player_Joined(uint indexed index, uint slot, address indexed player);
  event Game_SideB_Player_Joined(uint indexed index, uint slot, address indexed player);

  function joinGame_SideA(uint index, uint slot) public
  {
    addPlayerToGame_SideA(index, slot, msg.sender);
    emit Game_SideA_Player_Joined(index, slot, msg.sender);
  }
  function joinGame_SideB(uint index, uint slot) public
  {
    addPlayerToGame_SideB(index, slot, msg.sender);
    emit Game_SideB_Player_Joined(index, slot, msg.sender);
  }

  function addPlayerToGame_SideA(uint index, uint slot, address player) public
  {
    if (games_SideA[slot][index] == address(0))
    {
      games_SideA[slot][index] = player;
    }
  }
  function addPlayerToGame_SideB(uint index, uint slot, address player) public
  {
    if (games_SideB[slot][index] == address(0))
    {
      games_SideB[slot][index] = player;
    }
  }

  function getGameWinner_SideA(uint index) constant public returns (address)
  {
    return winners_SideA[index];
  }
  function getGameWinner_SideB(uint index) constant public returns (address)
  {
    return winners_SideB[index];
  }

  event GameWinner_SideA_Updated(uint indexed index, address indexed player);
  event GameWinner_SideB_Updated(uint indexed index, address indexed player);

  function setGameWinner_SideA(uint index, address player) public
  {
    winners_SideA[index] = player;

    uint start;
    uint finish;

    // find depth
    (start, finish) = getDepthRange(index);

    for (uint i = start; i < finish; i++)
    {
      if (games_SideA[0][i] == address(0))
      {
        addPlayerToGame_SideA(i, 0, player);
      }

      if (games_SideA[1][i] == address(0))
      {
        addPlayerToGame_SideA(i, 0, player);
      }
    }

    emit GameWinner_SideA_Updated(index, player);
  }
  function setGameWinner_SideB(uint index, address player) public
  {
    winners_SideB[index] = player;

    uint start;
    uint finish;

    // find depth
    (start, finish) = getDepthRange(index);

    for (uint i = start; i < finish; i++)
    {
      if (games_SideB[0][i] == address(0))
      {
        addPlayerToGame_SideB(i, 0, player);
      }

      if (games_SideB[1][i] == address(0))
      {
        addPlayerToGame_SideB(i, 0, player);
      }
    }

    emit GameWinner_SideB_Updated(index, player);
  }

  function getDepthRange(uint index) constant public returns (uint, uint)
  {
    if (numberOfParticipants == 32)
    {
      // depth = 4
      if (index >= 0 && index < 16)
      {
        return (16, 23);
      }

      if (index >= 16 && index < 24)
      {
        return (24, 28);
      }

      if (index >= 24 && index < 28)
      {
        return (28, 30);
      }

      if (index >= 28 && index < 30)
      {
        return (30, 31);
      }

      if (index >= 30 && index < 31)
      {
        return (31, 31);
      }
      //
    }

    if (numberOfParticipants == 16)
    {
      // depth = 3
      if (index >= 0 && index < 8)
      {
        return (8, 12);
      }

      if (index >= 8 && index < 12)
      {
        return (12, 14);
      }

      if (index >= 12 && index < 14)
      {
        return (14, 15);
      }

      if (index >= 14 && index < 15)
      {
        return (15, 15);
      }
      //
    }

    if (numberOfParticipants == 8)
    {
      // depth 2
      if (index >= 0 && index < 4)
      {
        return (4, 6);
      }

      if (index >= 4 && index < 6)
      {
        return (6, 7);
      }

      if (index >= 6 && index < 7)
      {
        return (7, 7);
      }
      //
    }

    if (numberOfParticipants == 4)
    {
      // depth 1
      if (index >= 0 && index < 2)
      {
        return (2, 3);
      }

      if (index >= 2 && index < 3)
      {
        return (3, 3);
      }
      //
    }

    if (numberOfParticipants == 2)
    {
      if (index >= 0 && index < 1)
      {
        return (1, 1);
      }
    }

    return (0, 0);
  }

  function getGame_SideA(uint index) constant public returns (address, address)
  {
    return (games_SideA[0][index], games_SideA[1][index]);
  }
  function getGame_SideB(uint index) constant public returns (address, address)
  {
    return (games_SideB[0][index], games_SideB[1][index]);
  }
}
