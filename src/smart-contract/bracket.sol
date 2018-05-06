/**
 * @title Pay2Play/Bracket Smart Contract
 * @url http://pay2play.io
 * @version 1.0.0
 */

pragma solidity ^0.4.21;

contract Registrar
{
  uint public registrarStartDate;

  address public node;
  address public tokenNode;

  Tournament[] tournaments;
  /* mapping (address => Tournament) public tournaments; */

  constructor(address _tokenNode) public
  {
    registrarStartDate = now;
    node = msg.sender;
    tokenNode = _tokenNode;
  }

  event NewBracketDeployed(uint indexed index, uint numberOfParticipants);

  function start(uint _numberOfParticipants) public
  {
    Tournament newTournament = (new Tournament)(_numberOfParticipants, msg.sender);

    tournaments.push(newTournament);

    uint index = tournaments.length - 1;

    emit NewBracketDeployed(index, _numberOfParticipants);
  }

  function getTournament(uint _index) constant public returns (uint, uint, uint, address, address)
  {
    Tournament tournament = tournaments[_index];
    return (_index, tournament.creationDate(), tournament.numberOfParticipants(), tournament.organizer(), tournament.winner());
  }

  function getTournamentContractAddress(uint _index) constant public returns (address)
  {
    return address(tournaments[_index]);
  }

  function getTournamentCount() constant public returns (uint)
  {
    return tournaments.length;
  }

  function getTournamentParticipantCount(uint _index) constant public returns (uint)
  {
    return tournaments[_index].numberOfParticipants();
  }

  // Getters
  // Side A
  function getSeats_SideA(uint _index) constant public returns (address[])
  {
    return tournaments[_index].getSeats_SideA();
  }

  function getPlayerSlot_SideA(uint _index, address _player) constant public returns (uint)
  {
    return tournaments[_index].getPlayerSlot_SideA(_player);
  }

  // Side B
  function getSeats_SideB(uint _index) constant public returns (address[])
  {
    return tournaments[_index].getSeats_SideB();
  }

  function getPlayerSlot_SideB(uint _index, address _player) constant public returns (uint)
  {
    return tournaments[_index].getPlayerSlot_SideB(_player);
  }
}

contract Tournament
{
  bool public active;
  uint public creationDate;
  uint public numberOfParticipants;

  uint constant minPrice = 0.01 ether;

  address public registrar;
  address public winner;
  address public organizer;

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

  constructor(uint _numberOfParticipants, address _organizer) public
  {
    active = true;
    creationDate = now;
    numberOfParticipants = _numberOfParticipants;
    organizer = _organizer;

    activate();
  }

  modifier onlyOrganizer
  {
      if (msg.sender != organizer) revert();
      _;
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

  function getNumberOfParticipants() constant public returns (uint)
  {
    return numberOfParticipants;
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

  function containsPlayer_SideA(address _player) constant public returns (bool)
  {
    return players_SideA[_player].exists;
  }

  function getPlayerSlot_SideA(address _player) constant public returns (uint)
  {
    return players_SideA[_player].slot;
  }

  function promotePlayer_SideA(address _player) onlyOrganizer public
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

  function containsPlayer_SideB(address _player) constant public returns (bool)
  {
    return players_SideB[_player].exists;
  }

  function getPlayerSlot_SideB(address _player) constant public returns (uint)
  {
    return players_SideB[_player].slot;
  }

  function promotePlayer_SideB(address _player) onlyOrganizer public
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

  function setWinner(address _player) onlyOrganizer public
  {
    winner = _player;
  }
}
