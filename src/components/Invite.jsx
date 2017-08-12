import React from 'react';
import WagerStore from '../stores/WagerStore';
import Web3Actions from '../actions/Web3Actions';

import {
  Link,
  Route,
  HashRouter as Router,
  withRouter
} from 'react-router-dom'

var Invite = React.createClass({
  getInitialState: function() {
    console.log(this.props.match.params.id);

    return WagerStore.get();
  },
  componentWillMount: function() {
    this.setState(WagerStore.get());

    Web3Actions.retrieveWager(this.props.match.params.id);
  },
  componentDidMount: function() {
    WagerStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    WagerStore.removeChangeListener(this._onChange);
  },
  _onChange: function() {
    this.setState(WagerStore.get());
  },
  render: function() {
    return (
      <div>
        <h1>Wager Invite</h1>
        <div>Wager Id: <Link to={`/wagers/${this.state.wager.index}`} replace>{this.state.wager.index}</Link></div>
        <div>Start Time: {this.state.wager.date}</div>
        <div>Amount: {this.state.wager.amount}</div>
        <h1>Rules</h1>
        <div>Swarm Hash: </div>
        <div className="highlighted">Game ends within</div>
        <h1>Players</h1>
        <div className="highlighted">Share this invite with your opponent or wait for someone to counter.</div>
        <h1>Event Logs</h1>
        <HomeButton to="/" label="Start Over" />
      </div>
    );
  }
});

const HomeButton = withRouter(({ history, label, to }) => (
  <div>
    <button type="button" className="btn-secondary" onClick={() => history.push(to)} >
      {label}
    </button>
  </div>
));
module.exports = Invite;
