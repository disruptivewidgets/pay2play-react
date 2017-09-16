import React from 'react';
import WagerBulkStore from '../stores/WagerBulkStore';
import Web3Actions from '../actions/Web3Actions';

import {
  Link,
  Route,
  HashRouter as Router,
  browserHistory, Redirect
} from 'react-router-dom'

var Wagers = React.createClass({
  getInitialState: function() {
    return WagerBulkStore.getList();
  },
  componentWillMount: function() {
    this.setState(WagerBulkStore.getList());
    Web3Actions.retrieveWagers();
  },
  componentDidMount: function() {
    WagerBulkStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    WagerBulkStore.removeChangeListener(this._onChange);
  },
  componentWillReceiveProps: function() {
  },
  _onChange: function() {
    this.setState(WagerBulkStore.getList());
  },
  render: function() {
    return (
      <div>
        <p className="highlighted">Wagers</p>

        {this.state.list.map(item => (
          <WagerItem
            key={item.id}
            item={item}
          />
        ))}

      </div>
    );
  }
});

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

function WagerItem(props) {
  const {item} = props;
  return (
    <div>
      <label>
        <Link to={`/invites/${item.index}`} replace>
          {item.index}
        </Link> | {item.state} | {item.players[0]} | {item.date} | {item.amount}
      </label>
    </div>
  );
}

module.exports = Wagers;
