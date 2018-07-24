var AppDispatcher = require('../dispatcher/AppDispatcher');
import DiscordBotActionTypes from '../constants/DiscordBotActionTypes';

module.exports = {
  retrievePlayers(response) {
    AppDispatcher.handleServerAction({
      actionType: DiscordBotActionTypes.RETRIEVE_PLAYERS_RESPONSE,
      response: response
    });
  },
  notify(response) {
    AppDispatcher.handleServerAction({
      actionType: DiscordBotActionTypes.NOTIFY_BUY_IN_RESPONSE,
      response: response
    });
  },
  ping(response) {
    console.log("ping");
    AppDispatcher.handleViewAction({
      actionType: DiscordBotActionTypes.PING,
      response: response
    });
  }
};
