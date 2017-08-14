import React from 'react';
import RuleStore from '../stores/RuleStore';
import SwarmActions from '../actions/SwarmActions';

import Web3Api from '../utils/Web3Api';

import * as moment from 'moment';
import 'moment-duration-format';

var Rules = React.createClass({
  getInitialState: function() {
    return RuleStore.getDataStore();
  },
  componentWillMount: function() {

    console.log(this.props);
    this.setState(RuleStore.getDataStore());

    SwarmActions.retrieveRules(this.props.referenceHash, this.props.startTimestamp);
  },
  componentDidMount: function() {
    RuleStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    RuleStore.removeChangeListener(this._onChange);
  },
  _onChange: function() {
    this.setState(RuleStore.getDataStore());
  },
  render: function() {
    return (
      <div>
        <h1>Rules</h1>
        <div>Swarm Hash: {this.props.referenceHash}</div>
        <div>Title: {this.state.rules.title}</div>
        <div>Rule: {this.state.rules.timeUntilEndString}</div>
      </div>
    );
  }
});

module.exports = Rules;
