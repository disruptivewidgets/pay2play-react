var AppDispatcher = require('../dispatcher/AppDispatcher');
import EventLogActionTypes from '../constants/EventLogActionTypes';
import EtherScanAPI from '../api/EtherScanAPI';

module.exports = {
  pullEventLogs(key, index) {
    AppDispatcher.handleViewAction({
      actionType: EventLogActionTypes.PULL_EVENT_LOGS,
    });

    EtherScanAPI.pullEventLogs(key, index);
  }
};
