/**
 * @title Pay2Play Smart Contract
 * @url http://pay2play.io
 * @version 0.1.0
 */

pragma solidity ^0.4.11;

contract Deposit {
  address public registrar;

  address constant burn = 0xdead;

  uint public creationDate;

  address public owner;
  uint public value;

  bool active;

  event BalanceTransfered(address winner);

  function Deposit(address _owner) payable {
      owner = _owner;
      registrar = msg.sender;
      creationDate = now;
      active = true;
      value = msg.value;
  }

  modifier onlyRegistrar {
      if (msg.sender != registrar) throw;
      _;
  }

  modifier onlyActive {
      if (!active) throw;
      _;
  }

  function setRegistrar(address _registrar) onlyRegistrar {
      registrar = _registrar;
  }

  function withdraw(address winner) onlyRegistrar {
    winner.transfer(this.balance);

    BalanceTransfered(winner);
  }
}

contract Registrar {

    uint public registrarStartDate;
    address public node;
    uint public fee;

    uint32 constant wagerWindow = 24 hours;
    uint constant minPrice = 0.01 ether;

    enum Mode { Open, Closed, Finished }

    struct wager {
        address[] depositors;
        uint createdAt;
        uint amount;
        address winner;
        bytes32 rulesHash;
    }

    wager[] public wagers;
    mapping (address => mapping(uint => Deposit)) public deposits;

    event WagerStarted(uint indexed index, uint createdAt);
    event NewDeposit(uint indexed index, address indexed owner, uint amount);

    event WagerWinnerUpdated(uint indexed index, address indexed winner);
    event WinningsWithdrawn(uint indexed index, address indexed winner, uint amount);

    function Registrar() {
        registrarStartDate = now;
        node = msg.sender;
    }

    modifier onlyRegistrar {
        if (msg.sender != node) throw;
        _;
    }

    modifier onlyWinner(uint index) {
        wager w = wagers[index];
        if (msg.sender != w.winner) throw;
        _;
    }

    function state(uint index) constant returns (Mode) {
        var wager = wagers[index];

        if (wager.winner != node) {
          return Mode.Finished;
        }

        if (wager.depositors.length == 1) {
          return Mode.Open;
        }

        if (wager.depositors.length == 2) {
          return Mode.Closed;
        }
    }

    modifier inState(uint _index, Mode _state) {
        if(state(_index) != _state) throw;
        _;
    }

    function getWager(uint index) constant returns (Mode, uint, uint, address, address[], bytes32) {
        wager w = wagers[index];

        address[] memory owners = new address[](w.depositors.length);

        for (uint i = 0; i < w.depositors.length; i++) {
          owners[i] = w.depositors[i];
        }

        return (state(index), w.createdAt, w.amount, w.winner, owners, w.rulesHash);
    }

    function getWagerCount() public constant returns (uint) {
        return wagers.length;
    }

    function createWager(bytes32 rulesHash) constant returns (uint) {
        uint index = wagers.length;

        wagers.push(wager(new address[](0), now, 0, node, rulesHash));

        WagerStarted(index, now);

        return index;
    }

    function newDeposit(uint index) payable {
        if (msg.value < minPrice) throw;

        if (address(deposits[msg.sender][index]) > 0 ) throw;

        Deposit newDeposit = (new Deposit).value(msg.value)(msg.sender);

        deposits[msg.sender][index] = newDeposit;

        wager w = wagers[index];

        w.depositors.push(msg.sender);

        w.amount = w.amount + msg.value;

        NewDeposit(index, msg.sender, msg.value);
    }

    function createWagerAndDeposit(bytes32 rulesHash) payable {
        uint index = createWager(rulesHash);
        newDeposit(index);
    }

    function counterWagerAndDeposit(uint index) payable {
        newDeposit(index);
    }

    function setWagerWinner(uint index, address winner) onlyRegistrar {
      wager w = wagers[index];

      w.winner = winner;

      WagerWinnerUpdated(index, winner);
    }

    function withdrawWinnings(uint index) onlyWinner(index) {
      wager w = wagers[index];

      for (uint i = 0; i < w.depositors.length; i++) {
        deposits[w.depositors[i]][index].withdraw(w.winner);
      }

      WinningsWithdrawn(index, w.winner, w.amount);
    }
}
