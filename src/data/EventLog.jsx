import Immutable from 'immutable';

const EventLog = Immutable.Record({
  id: '',
  topic: '',
  transactionHash: ''
});

export default EventLog;
