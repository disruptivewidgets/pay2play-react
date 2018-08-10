var AppDispatcher = require('../dispatcher/AppDispatcher');
import GameRulesActionTypes from '../constants/GameRulesActionTypes';
import RulesAPI from '../api/RulesAPI';

module.exports = {
  retrieveGames() {
    AppDispatcher.handleViewAction({
      actionType: GameRulesActionTypes.RETRIEVE_GAME_RULES,
    });

    RulesAPI.getGames();
  },
  retrieveRules(hash, wagerStartTimestamp) {
    console.log("hash: " + hash);
    RulesAPI.getGameRules(hash, wagerStartTimestamp);
  }
};
