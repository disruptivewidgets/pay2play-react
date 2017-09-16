import Immutable from 'immutable';

const EventLog = Immutable.Record({
  id: '',
  topic: '',
  txid: '',
  wagerId: 0
});

export default EventLog;
