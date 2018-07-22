import React, { Component } from 'react';
import RuleStore from '../stores/RuleStore';
import GameActions from '../actions/GameActions';

import Formatter from "../helpers/Formatters.js";

import * as moment from 'moment';
import 'moment-duration-format';

export default class Rules extends Component
{
  constructor(props)
  {
    super(props);
    this.state = RuleStore.getDataStore();
    this._onChange = this._onChange.bind(this);
  }
  componentWillMount()
  {
    this.setState(RuleStore.getDataStore());

    GameActions.retrieveRules(this.props.referenceHash, this.props.startTimestamp);
  }
  componentWillReceiveProps(nextProps)
  {
    GameActions.retrieveRules(this.props.referenceHash, this.props.startTimestamp);
  }
  componentDidMount()
  {
    RuleStore.addChangeListener(this._onChange);
  }
  componentWillUnmount()
  {
    RuleStore.removeChangeListener(this._onChange);
  }
  _onChange()
  {
    this.setState(RuleStore.getDataStore());
  }
  render() {
    return (
      <div>
        <div className="highlighted">Rules</div>
        <br />
        <div>Rules Hash: {Formatter.formatRulesHash(this.props.referenceHash)}</div>
        <div>Title: {this.state.rules.title}</div>
        {/* <div>Time Window: {this.state.rules.timeUntilEndString}</div> */}
      </div>
    );
  }
};

// module.exports = Rules;
