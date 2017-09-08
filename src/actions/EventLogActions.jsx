var AppDispatcher = require('../dispatcher/AppDispatcher');
import EventLogActionTypes from '../constants/EventLogActionTypes';
import EtherScanApi from '../utils/EtherScanApi';

module.exports = {
  pullEventLogs(key, index) {
    AppDispatcher.handleViewAction({
      actionType: EventLogActionTypes.PULL_EVENT_LOGS,
    });

    EtherScanApi.pullEventLogs(key, index);
  }
};
