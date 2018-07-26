import AppDispatcher from '../dispatcher/AppDispatcher';
import Web3ActionTypes from '../constants/Web3ActionTypes';
import Web3API from '../api/Web3API';

const Actions = {
  retrieveWagers() {
    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.RETRIEVE_WAGERS,
    });

    Web3API.retrieveWagers();
  },
  retrieveWager(id) {
    console.log("B");
    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.RETRIEVE_WAGER,
    });

    Web3API.retrieveWager(id);
  },
  getAccounts() {
    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.RETRIEVE_ACCOUNTS,
    });

    Web3API.getAccounts();
  },
  startWager(hash, address, params) {
    console.log('startWager');

    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.START_WAGER,
    });

    Web3API.startWager(hash, address, params);
  },
  counterWagerAndDeposit(wagerId, address, params) {
    console.log('counterWagerAndDeposit');

    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.COUNTER_WAGER_AND_DEPOSIT,
    });

    Web3API.counterWagerAndDeposit(wagerId, address, params);
  },
  setWagerWinner(wagerId, winner, params) {
    console.log('setWagerWinner');

    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.SET_WAGER_WINNER,
    });

    Web3API.setWagerWinner(wagerId, winner, params);
  },
  withdrawWinnings(wagerId, params) {
    console.log('withdrawWinnings');

    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.WITHDRAW_WINNINGS,
    });

    Web3API.withdrawWinnings(wagerId, params);
  },
  setSecret(secret, params) {
    console.log('setSecret');

    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.SET_SECRET,
    });

    Web3API.setSecret(secret, params);
  },
  getSecretHash(address) {
    console.log('getSecretHash');

    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.GET_SECRET_HASH,
    });

    Web3API.getSecretHash(address);
  },
  // Bracket
  startBracket(numberOfParticipants, params)
  {
    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.START_BRACKET,
    });

    Web3API.startBracket(numberOfParticipants, params);
  },
  retrieveBrackets() {
    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.RETRIEVE_BRACKETS,
    });

    Web3API.retrieveBrackets();
  },
  retrieveBracket(index) {
    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.RETRIEVE_BRACKET,
    });

    Web3API.retrieveBracket(index);
  },
  getSeats_SideA() {
    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.GET_SEATS_SIDE_A,
    });

    Web3API.getSeats_SideA();
  },
  getSeats_SideB() {
    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.GET_SEATS_SIDE_B,
    });

    Web3API.getSeats_SideB();
  },
  takeSeat_SideA(bracketId, seat, params) {
    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.TAKE_SEAT_SIDE_A,
    });

    Web3API.takeSeat_SideA(bracketId, seat, params);
  },
  takeSeat_SideB(bracketId, seat, params) {
    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.TAKE_SEAT_SIDE_B,
    });

    Web3API.takeSeat_SideB(bracketId, seat, params);
  },
  promotePlayer_SideA(bracketId, seat, address, params)
  {
    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.PROMOTE_PLAYER_SIDE_A,
    });

    Web3API.promotePlayer_SideA(bracketId, seat, address, params);
  },
  promotePlayer_SideB(bracketId, seat, address, params)
  {
    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.PROMOTE_PLAYER_SIDE_B,
    });

    Web3API.promotePlayer_SideB(bracketId, seat, address, params);
  },
  setBracketWinner(bracketId, address, params)
  {
    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.SET_BRACKET_WINNER,
    });

    Web3API.setBracketWinner(bracketId, address, params);
  },
  // Misc
  ping() {
    console.log('start wager');

    AppDispatcher.handleViewAction({
      actionType: Web3ActionTypes.PING,
    });

    Web3API.ping();
  }
}

export default Actions;
