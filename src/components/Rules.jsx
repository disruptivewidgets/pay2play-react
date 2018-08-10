import React, { Component } from 'react';
import RuleStore from '../stores/RuleStore';
import GameRulesActions from '../actions/GameRulesActions';

import Formatter from "../helpers/Formatters.js";

import * as moment from 'moment';
import 'moment-duration-format';

class Rules extends Component
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

    GameRulesActions.retrieveRules(this.props.referenceHash, this.props.startTimestamp);
  }
  componentWillReceiveProps(nextProps)
  {
    GameRulesActions.retrieveRules(this.props.referenceHash, this.props.startTimestamp);
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
function fetchGame(referenceHash) {

  switch (referenceHash) {
    case window.web3.utils.sha3("0"):
      return {
          id: 0,
          title: "Hearthstone"
        };
      break;
    case window.web3.utils.sha3("1"):
      return {
        id: 1,
        title: "Fortnite"
      };
      break;
    case window.web3.utils.sha3("2"):
      return {
          id: 2,
          title: "League Of Legends"
      };
      break;
    case window.web3.utils.sha3("3"):
      return {
          id: 3,
          title: "Starcraft"
      };
      break;
    case window.web3.utils.sha3("4"):
      return {
          id: 4,
          title: "Masters Of Conquest"
      };
      break;
    default:
      return {
          id: 999,
          title: "Pay2Play"
      };
      break;
  }
}
export { Rules, fetchGame };
