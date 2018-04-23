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

contract Event
{
  bool public active;
  uint public creationDate;

  address public winner;

  uint size;

  address[] public sideA;
  address[] public sideB;

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
    size = _numberOfParticipants * 2;

    sideA = new address[_numberOfParticipants];
    sideB = new address[_numberOfParticipants];

    matchesSideA = new match[_numberOfParticipants - 1];
    matchesSideB = new match[_numberOfParticipants - 1];

    for (uint i = 0; i < _numberOfParticipants; i++)
    {
      matchesSideA[i] = new match();
      matchesSideB[i] = new match();
    }
    // calculate count of matches on side A

    // calculate count of matches on side B

    // find height log_2(n)

    // number of nodes pow(2,n) - 1

    // number of nodes in a tree = n - 1

  }
}
