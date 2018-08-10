var AppDispatcher = require('../dispatcher/AppDispatcher');
import GameRulesActionTypes from '../constants/GameRulesActionTypes';

module.exports = {
  receivedGames(response) {
    AppDispatcher.handleServerAction({
      actionType: GameRulesActionTypes.RETRIEVE_GAME_RULES_RESPONSE,
      response: response
    });
  },
  receivedGameRules(response) {
    AppDispatcher.handleServerAction({
      actionType: GameRulesActionTypes.RETRIEVE_GAME_RULES_RESPONSE,
      response: response
    });
  },
};
