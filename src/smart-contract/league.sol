/**
 * @title Pay2Play/League Smart Contract
 * @url http://pay2play.io
 * @version 1.0.0
 */

pragma solidity ^0.4.25;

contract Registrar {
  uint public registrarStartDate;

  address public node;
  address public tokenNode;

  League[] leagues;

  constructor(address _tokenNode) public {
    registrarStartDate = now;
    node = msg.sender;
    tokenNode = _tokenNode;
  }

  event NewLeagueStarted(uint indexed index, uint numberOfParticipants);

  function start(uint _numberOfParticipants) public {
    League league = (new League)(_numberOfParticipants, msg.sender);

    leagues.push(league);

    uint index = leagues.length - 1;

    emit NewLeagueStarted(index, _numberOfParticipants);
  }

  function getLeague(uint _index) constant public returns (uint, uint, uint, address, address) {
    League league = leagues[_index];
    return (_index, league.creationDate(), league.numberOfParticipants(), league.organizer(), league.winner());
  }

  function getLeagueContractAddress(uint _index) constant public returns (address) {
    return address(leagues[_index]);
  }

  function getLeagueCount() constant public returns (uint) {
    return leagues.length;
  }

  function getLeagueParticipantCount(uint _index) constant public returns (uint) {
    return leagues[_index].numberOfParticipants();
  }
}

contract League {
  bool public active;
  uint public creationDate;
  uint public numberOfParticipants;

  uint constant minPrice = 0.01 ether;

  address public registrar;
  address public winner;
  address public organizer;

  address[] participants;

  Round[] rounds;

  struct Round {
    uint[2][] opponents;
    uint[2][] points;
  }

  constructor(uint _numberOfParticipants, address _organizer) public {
    active = true;
    creationDate = now;
    numberOfParticipants = _numberOfParticipants;
    organizer = _organizer;

    activate();
  }

  event PlayerExists(address player);
  event PlayerJoined(uint index);

  modifier onlyOrganizer {
      if (msg.sender != organizer) revert();
      _;
  }

  function activate() public {
    for (uint i = 0; i < numberOfParticipants; i++) {
      participants.push(address(0));
    }
  }

  function getNumberOfParticipants() constant public returns (uint256) {
    return numberOfParticipants;
  }

  function getParticipants() constant public returns (address[]) {
      return (participants);
  }

  function joinLeague() payable public {
    uint openSlotIndex = uint(-1);

    for (uint i = 0; i < numberOfParticipants; i++) {
      if (participants[i] == msg.sender) {
        emit PlayerExists(msg.sender);
        revert();
      }

      if (participants[i] == address(0)) {
        openSlotIndex = i;
      }
    }

    if (openSlotIndex != uint(-1)) {
      participants[openSlotIndex] = msg.sender;
      emit PlayerJoined(openSlotIndex);
    }
  }

  function startRound() onlyOrganizer payable public {
    uint matchCount = numberOfParticipants * 10 / 2 * (numberOfParticipants - 1) / 10; // division by float issue

    rounds.length += 1;
    Round storage r = rounds[rounds.length - 1];

    uint placeholder = numberOfParticipants + 1;

    for (uint i = 0; i < matchCount; i++) {
        r.opponents.push([placeholder, placeholder]);
        r.points.push([uint(0), uint(0)]);
    }
  }

  function calculate(uint _roundIndex) onlyOrganizer payable public {
      uint[] memory temp = new uint[](numberOfParticipants - 2 + 1);

      uint n = 2;
      uint i = 0;

      for (n = 2; n <= numberOfParticipants; n++) {
          temp[n - 2] = n;
      }

      uint[] memory buffer = new uint[](temp.length);

      uint[][] memory tables = new uint[][](numberOfParticipants - 1);

      for (n = 0; n < numberOfParticipants - 1; n++) {
          for (i = 0; i <= temp.length - 1; i++) {
              buffer[(i + n) % temp.length] = temp[i];
          }

          uint[] memory table = new uint[](numberOfParticipants);
          table[0] = 1;

          for (i = 1; i < numberOfParticipants; i++) {
              table[i] = buffer[i - 1];
          }

          tables[n] = table;
      }

      uint size = 0;

      if (numberOfParticipants % 2 == 0) {
        size = numberOfParticipants / 2;
      } else {
        size = (numberOfParticipants + 1) / 2;
      }

      for (n = 0; n < tables.length; n++) {
          table = tables[n];

          for (i = 0; i < size; i++) {
            rounds[_roundIndex].opponents[n * size + i][0] = table[i];
            rounds[_roundIndex].opponents[n * size + i][1] = table[(numberOfParticipants - 1) - i];
          }
      }
  }

  function getRoundOpponents(uint _roundIndex) constant public returns (uint[2][]) {
    return (rounds[_roundIndex].opponents);
  }

  function getRoundPoints(uint _roundIndex) constant public returns (uint[2][]) {
    return (rounds[_roundIndex].points);
  }

  function getMatches(uint _roundIndex) constant public returns (uint[2][], uint[2][]) {
    return (rounds[_roundIndex].opponents, rounds[_roundIndex].points);
  }

  function getMatch(uint _roundIndex, uint _matchIndex) constant public returns (uint[2], uint[2]) {
    return (rounds[_roundIndex].opponents[_matchIndex], rounds[_roundIndex].points[_matchIndex]);
  }

  function getRoundCount() constant public returns (uint256) {
    return rounds.length;
  }

  function getMatchCount(uint _roundIndex) constant public returns (uint256) {
    return rounds[_roundIndex].opponents.length;
  }
}
