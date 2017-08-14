var AppDispatcher = require('../dispatcher/AppDispatcher');
import EventLogActionTypes from '../constants/EventLogActionTypes';

module.exports = {
  receivedLogs(response) {
    AppDispatcher.handleServerAction({
      actionType: EventLogActionTypes.PULL_EVENT_LOGS_RESPONSE,
      response: response
    });
  },
};
