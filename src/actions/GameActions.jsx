var AppDispatcher = require('../dispatcher/AppDispatcher');
import GameActionTypes from '../constants/GameActionTypes';
import RulesAPI from '../api/RulesAPI';

module.exports = {
  retrieveGames() {
    AppDispatcher.handleViewAction({
      actionType: GameActionTypes.RETRIEVE_GAMES,
    });

    RulesAPI.getGames();
  },
  retrieveRules(hash, wagerStartTimestamp) {
    console.log("hash: " + hash);
    RulesAPI.getGameRules(hash, wagerStartTimestamp);
  }
};
