/**
 * @title Pay2Play Smart Contract
 * @url http://pay2play.io
 * @version 1.0.0
 */

pragma solidity ^0.4.21;

import './ERC20.sol';

contract Deposit {
  address public registrar;

  address constant burn = 0xdead;

  uint public creationDate;

  address public owner;
  uint public value;

  bool public active;

  event BalanceTransfered(address indexed winner);

  constructor(address _owner) payable public {
    owner = _owner;
    registrar = msg.sender;
    creationDate = now;
    active = true;
    value = msg.value;
  }

  modifier onlyRegistrar {
      if (msg.sender != registrar) revert();
      _;
  }

  modifier onlyActive {
      if (!active) revert();
      _;
  }

  function setRegistrar(address _registrar) onlyRegistrar public {
      registrar = _registrar;
  }

  function withdraw(address winner) onlyRegistrar public {
    winner.transfer(this.balance);

    value = 0;
    active = false;

    emit BalanceTransfered(winner);
  }

  function getActiveState() constant public returns (bool) {
    return active;
  }
}

contract Registrar {
    uint public registrarStartDate;
    address public node;
    address public tokenNode;
    uint public fee;

    uint32 constant wagerWindow = 24 hours;
    uint constant minPrice = 0.01 ether;

    enum Mode { Open, Closed, Finished, Settled }

    struct wager {
        address[] players;
        uint createdAt;
        uint amount;
        address winner;
        bytes32 rulesHash;
    }

    wager[] public wagers;
    mapping (address => mapping(uint => Deposit)) public deposits;

    mapping(address => uint) winCount;
    mapping(address => uint) lossCount;

    address[] moderators;

    event NewDeposit(uint indexed index, address indexed sponsor, address indexed owner, uint amount);

    event WagerStarted(uint indexed index, address indexed player, uint createdAt);
    event WagerCountered(uint indexed index, address indexed player, address indexed opponent, uint createdAt);

    event WagerWinnerUpdated(uint indexed index, address indexed winner);
    event WinningsWithdrawn(uint indexed index, address indexed winner, uint amount);

    event ModeratorListUpdated(address indexed moderator);

    constructor(address _tokenNode) public{
      registrarStartDate = now;
      node = msg.sender;
      tokenNode = _tokenNode;
    }

    modifier onlyRegistrar {
        if (msg.sender != node) revert();
        _;
    }

    modifier onlyWinner(uint index) {
        wager memory w = wagers[index];
        if (msg.sender != w.winner) revert();
        _;
    }

    function state(uint index) constant public returns (Mode) {
        wager memory w = wagers[index];

        if (w.winner != node) {
          Deposit deposit = deposits[w.winner][index];

          if (deposit.getActiveState() != true) {
            return Mode.Settled;
          }

          return Mode.Finished;
        }

        if (w.players.length == 1) {
          return Mode.Open;
        }

        if (w.players.length == 2) {
          return Mode.Closed;
        }
    }

    function isModerator(address moderator) constant public returns(bool) {
      for (uint i = 0; i < moderators.length; i++) {
        if (moderators[i] == moderator) {
          return true;
        }
      }
      return false;
    }

    modifier inState(uint _index, Mode _state) {
        if(state(_index) != _state) revert();
        _;
    }

    function getWager(uint index) constant public returns (Mode, uint, uint, address, address[], bytes32) {
        wager memory w = wagers[index];

        address[] memory owners = new address[](w.players.length);

        for (uint i = 0; i < w.players.length; i++) {
          owners[i] = w.players[i];
        }

        return (state(index), w.createdAt, w.amount, w.winner, owners, w.rulesHash);
    }

    function getWinCount(address player) constant public returns (uint) {
        return winCount[player];
    }

    function getLossCount(address player) constant public returns (uint) {
        return lossCount[player];
    }

    function getWagerCount() public constant returns (uint) {
        return wagers.length;
    }

    function createWager(bytes32 rulesHash) constant public returns (uint) {
        uint index = wagers.length;
        wagers.push(wager(new address[](0), now, 0, node, rulesHash));
        return index;
    }

    function newDeposit(uint index, address player) payable public {
        if (msg.value < minPrice) revert();

        if (address(deposits[player][index]) > 0 ) revert();

        Deposit deposit = (new Deposit).value(msg.value)(player);

        deposits[player][index] = deposit;

        wager storage w = wagers[index];

        w.players.push(player);

        w.amount = w.amount + msg.value;

        emit NewDeposit(index, msg.sender, player, msg.value);
    }

    function createWagerAndDeposit(bytes32 rulesHash, address player) payable public {
        uint index = createWager(rulesHash);
        newDeposit(index, player);

        emit WagerStarted(index, player, now);
    }

    function counterWagerAndDeposit(uint index, address player) payable public {
        newDeposit(index, player);

        wager storage w = wagers[index];

        emit WagerCountered(index, player, w.players[0], now);
    }

    function setWagerWinner(uint index, address winner) onlyRegistrar public {
      wager memory w = wagers[index];

      w.winner = winner;

      ERC20Interface(tokenNode).transfer(winner, 1);

      for (uint i = 0; i < w.players.length; i++) {
        if (w.players[i] == winner) {
          winCount[winner] += 1;
        } else {
          lossCount[w.players[i]] += 1;
        }
      }

      emit WagerWinnerUpdated(index, winner);
    }

    function withdrawWinnings(uint index) onlyWinner(index) public {
      wager memory w = wagers[index];

      for (uint i = 0; i < w.players.length; i++) {
        deposits[w.players[i]][index].withdraw(w.winner);
      }
      emit WinningsWithdrawn(index, w.winner, w.amount);
    }

    function addModerator(address moderator) onlyRegistrar public {
      if (isModerator(moderator) != true) {
        moderators.push(moderator);
        emit ModeratorListUpdated(moderator);
      }
    }

    mapping (address => bytes32) public secrets;

    function setSecret(bytes32 _value) public {
      secrets[msg.sender] = keccak256(_value);
    }

    function hashValue(bytes32 _value) pure public returns (bytes32) {
      return keccak256(_value);
    }

    enum Error { None, Mismatch }

    function getTokenBalance(address _address, bytes32 _value) constant public returns (Error, uint) {
      bytes32 secret = hashValue(_value);

      if (secrets[_address] == secret) {
        uint balance = ERC20Interface(tokenNode).balanceOf(_address);
        return (Error.None, balance);
      } else {
        return (Error.Mismatch, 0);
      }
    }
}
