/**
 * @title Pay2Play/Bracket Smart Contract
 * @url http://pay2play.io
 * @version 1.0.0
 */

pragma solidity ^0.4.21;

contract Match
{
  struct match
  {
      address[] participants;
      uint createdAt;
      uint amount;
      address winner;
  }
}

// 1, 2, 3,  4,  5
// 2, 4, 8, 16, 32

// calculate count of matches on side A

// calculate count of matches on side B

// find height log_2(n)

// number of nodes pow(2,n) - 1

// number of nodes in a tree = n - 1

contract Event
{
  bool public active;
  uint public creationDate;

  address public winner;

  address constant burn = 0xdead;

  struct match
  {
      address[] participants;
      address winner;
  }

  match[] public matchesSideA;
  match[] public matchesSideB;

  function Event(uint _numberOfParticipants) payable public
  {
    active = true;
    creationDate = now;

    matchesSideA = new match[_numberOfParticipants - 1];
    matchesSideB = new match[_numberOfParticipants - 1];

    for (uint i = 0; i < _numberOfParticipants; i++)
    {
      matchesSideA[i] = match(new address[](2), burn);
      matchesSideB[i] = match(new address[](2), burn);
    }

    if (_numberOfParticipants == 32)
    {
      //A
      matchesSideA[4] = new match[](16);
      matchesSideA[3] = new match[](8);
      matchesSideA[2] = new match[](4);
      matchesSideA[1] = new match[](2);
      matchesSideA[0] = new match[](1);

      //B
      matchesSideB[4] = new match[](16);
      matchesSideB[3] = new match[](8);
      matchesSideB[2] = new match[](4);
      matchesSideB[1] = new match[](2);
      matchesSideB[0] = new match[](1);
    }

    if (_numberOfParticipants == 16)
    {
      //A
      matchesSideA[3] = new match[](8);
      matchesSideA[2] = new match[](4);
      matchesSideA[1] = new match[](2);
      matchesSideA[0] = new match[](1);

      //B
      matchesSideB[3] = new match[](8);
      matchesSideB[2] = new match[](4);
      matchesSideB[1] = new match[](2);
      matchesSideB[0] = new match[](1);
    }

    if (_numberOfParticipants == 8)
    {
      //A
      matchesSideA[2] = new match[](4);
      matchesSideA[1] = new match[](2);
      matchesSideA[0] = new match[](1);

      //B
      matchesSideB[2] = new match[](4);
      matchesSideB[1] = new match[](2);
      matchesSideB[0] = new match[](1);
    }

    if (_numberOfParticipants == 4)
    {
      //A
      matchesSideA[1] = new match[](2);
      matchesSideA[0] = new match[](1);

      //B
      matchesSideB[1] = new match[](2);
      matchesSideB[0] = new match[](1);
    }

    if (_numberOfParticipants == 2)
    {
      //A
      matchesSideA[0] = new match[](1);

      //B
      matchesSideA[0] = new match[](1);
    }
  }

  event Match_SideA_Player_Joined(uint indexed level, uint indexed index, uint indexed slot, address indexed player);
  event Match_SideB_Player_Joined(uint indexed level, uint indexed index, uint indexed slot, address indexed player);

  function joinMatch_SideA(uint index)
  {
    uint level = 4;

    if (_numberOfParticipants == 32)
    {
      level = 4;
    }
    if (_numberOfParticipants == 16)
    {
      level = 3;
    }
    if (_numberOfParticipants == 8)
    {
      level = 2;
    }
    if (_numberOfParticipants == 4)
    {
      level = 1;
    }
    if (_numberOfParticipants == 2)
    {
      level = 0;
    }

    address player = msg.sender;
    match m = matchesSideA[level][index];

    if (m.participants[0] == address(0))
    {
      m.participants.push(player);
      emit Match_SideA_Player_Joined(level, index, 0, player);
      return;
    }

    if (m.participants[1] == address(0))
    {
      m.participants.push(player);
      emit Match_SideA_Player_Joined(level, index, 1, player);
      return;
    }
  }
  function joinMatch_SideB(uint index)
  {
    uint level = 4;

    if (_numberOfParticipants == 32)
    {
      level = 4;
    }
    if (_numberOfParticipants == 16)
    {
      level = 3;
    }
    if (_numberOfParticipants == 8)
    {
      level = 2;
    }
    if (_numberOfParticipants == 4)
    {
      level = 1;
    }
    if (_numberOfParticipants == 2)
    {
      level = 0;
    }

    address player = msg.sender;
    match m = matchesSideB[level][index];

    if (m.participants[0] == address(0))
    {
      m.participants.push(player);
      emit Match_SideB_Player_Joined(level, index, 0, player);
      return;
    }

    if (m.participants[1] == address(0))
    {
      m.participants.push(player);
      emit Match_SideB_Player_Joined(level, index, 1, player);
      return;
    }
  }

  function getMatchWinner_SideA(uint level, uint index) constant public returns (address)
  {
    match m = matchesSideA[level][index];
    return m.winner;
  }
  function getMatchWinner_SideB(uint level, uint index) constant public returns (address)
  {
    match m = matchesSideB[level][index];
    return m.winner;
  }

  event MatchWinner_SideA_Updated(uint indexed level, uint indexed index, address indexed winner);
  event MatchWinner_SideB_Updated(uint indexed level, uint indexed index, address indexed winner);

  function setMatchWinner_SideA(uint level, uint index, address winner) onlyRegistrar public
  {
    match m = matchesSideA[level][index];
    m.winner = winner;

    emit MatchWinner_SideA_Updated(level, index, winner);
  }
  function setMatchWinner_SideB(uint level, uint index, address winner) onlyRegistrar public
  {
    match m = matchesSideB[level][index];
    m.winner = winner;

    emit MatchWinner_SideB_Updated(level, index, winner);
  }
}
