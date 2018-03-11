var AppDispatcher = require('../dispatcher/AppDispatcher');
import GameActionTypes from '../constants/GameActionTypes';

module.exports = {
  receivedGames(response) {
    AppDispatcher.handleServerAction({
      actionType: GameActionTypes.RETRIEVE_GAMES_RESPONSE,
      response: response
    });
  },
  receivedGameRules(response) {
    AppDispatcher.handleServerAction({
      actionType: GameActionTypes.RETRIEVE_GAME_RULES_RESPONSE,
      response: response
    });
  },
};
