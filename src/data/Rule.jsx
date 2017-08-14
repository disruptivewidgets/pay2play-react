import Immutable from 'immutable';

const Rule = Immutable.Record({
  id: '',
  duration: 0,
  rule: '',
  title: '',
  referenceHash: '',
  timeUntilEndString: ''
});

export default Rule;
