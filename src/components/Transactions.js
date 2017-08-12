import React from 'react';
import TransactionStore from '../stores/TransactionStore';
import Web3Actions from '../actions/Web3Actions';

var Transactions = React.createClass({
  getInitialState: function() {
    return TransactionStore.getList();
  },
  componentWillMount: function() {
    this.setState(TransactionStore.getList());
    Web3Actions.retrieveTransactions();
  },
  componentDidMount: function() {
    TransactionStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    TransactionStore.removeChangeListener(this._onChange);
  },
  _onChange: function() {
    this.setState(TransactionStore.getList());
  },
  render: function() {
    return (
      <div>
        <p className="highlighted">Transactions</p>
        {this.state.list.map(item => (
          <TransactionItem
            key={item.id}
            item={item}
          />
        ))}
      </div>
    );
  }
});

function TransactionItem(props) {
  const {item} = props;
  return (
    <li>
      <div>
        <label>
          {item.index} | {item.state} | {item.date} | {item.amount} | {item.referenceHash}
        </label>
      </div>
    </li>
  );
}

module.exports = Transactions;
