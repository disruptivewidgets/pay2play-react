import React from 'react';
import WagerStore from '../stores/WagerStore';
import Web3Actions from '../actions/Web3Actions';
import Invite from '../components/Invite';
import Rules from '../components/Rules';
import EventLogs from '../components/EventLogs';

import { Intent, Spinner } from "@blueprintjs/core";

import "@blueprintjs/core/dist/blueprint.css";

import {
  Link,
  withRouter
} from 'react-router-dom'

var Wager = React.createClass({
  getInitialState: function() {
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
    const referenceHash = this.state.wager.referenceHash;
    const startTimestamp = this.state.wager.startTimestamp;

    return (
        <div>
          <h1>Wager Ticket</h1>
          <div>Wager Id: {this.state.wager.index}</div>
          <div>Start Time: {this.state.wager.date}</div>
          <div>{this.state.wager.state}</div>
          <div>Amount: {this.state.wager.amount}</div>

          { referenceHash ? (
            <Rules referenceHash={referenceHash} startTimestamp={startTimestamp} />
          ) : (
            <Spinner intent={Intent.PRIMARY} />
          )}

          <h1>Related</h1>
          <div>Invite Id: <Link to={`/invites/${this.state.wager.index}`} replace>{this.state.wager.index}</Link></div>
          <EventLogs index={this.props.match.params.id} />

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
module.exports = Wager;
