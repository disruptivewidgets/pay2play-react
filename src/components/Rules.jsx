import React from 'react';
import RuleStore from '../stores/RuleStore';
import GameActions from '../actions/GameActions';

import Web3Api from '../utils/Web3Api';

import * as moment from 'moment';
import 'moment-duration-format';

var Rules = React.createClass({
  getInitialState: function() {
    return RuleStore.getDataStore();
  },
  componentWillMount: function() {
    console.log("props");
    
    console.log(this.props);
    this.setState(RuleStore.getDataStore());

    GameActions.retrieveRules(this.props.referenceHash, this.props.startTimestamp);
  },
  componentWillReceiveProps: function(nextProps) {
    console.log("componentWillReceiveProps");

    GameActions.retrieveRules(this.props.referenceHash, this.props.startTimestamp);
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
        <div className="highlighted">Rules</div>
        <br />
        <div>Rules Hash: {this.props.referenceHash}</div>
        <div>Title: {this.state.rules.title}</div>
        <div>Time Window: {this.state.rules.timeUntilEndString}</div>
      </div>
    );
  }
});

module.exports = Rules;
