var AppDispatcher = require('../dispatcher/AppDispatcher');
import SwarmActionTypes from '../constants/SwarmActionTypes';

module.exports = {
  receivedGames(response) {
    AppDispatcher.handleServerAction({
      actionType: SwarmActionTypes.RETRIEVE_GAMES_RESPONSE,
      response: response
    });
  },
  receivedGameRules(response) {
    AppDispatcher.handleServerAction({
      actionType: SwarmActionTypes.RETRIEVE_GAME_RULES_RESPONSE,
      response: response
    });
  },
};
