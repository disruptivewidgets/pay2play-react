import Immutable from 'immutable';

const Wager = Immutable.Record({
  id: '',
  index: '',
  state: '',
  date: '',
  amount: 0
});

export default Wager;
