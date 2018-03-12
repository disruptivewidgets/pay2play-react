import Immutable from 'immutable';

const CacheRecord = Immutable.Record({
  id: '',
  txnId: '',
  status: '',
  type: '',
  wagerId: ''
});

export default CacheRecord;
