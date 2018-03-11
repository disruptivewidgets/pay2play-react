import React from 'react';
import WagerStore from '../stores/WagerStore';

import GameActions from '../actions/GameActions';
import Web3Actions from '../actions/Web3Actions';
import RulesAPI from '../utils/RulesAPI.js';

import Web3Store from '../stores/Web3Store';
import GameStore from '../stores/GameStore';
import GameSelector from '../components/GameSelector';

import TransactionHelper from "../helpers/TransactionUtils.js";
import SessionHelper from "../helpers/SessionUtils.js";
import QueueManager from "../helpers/QueueManager.js";

import { Intent, Spinner } from "@blueprintjs/core/dist";

import "@blueprintjs/core/dist/blueprint.css";

var validator = require('validator');

import {
  Link,
  withRouter
} from 'react-router-dom'

import _ from 'lodash';

var Start = React.createClass({
  getInitialState: function() {
    return GameStore.getDataStore();
  },
  componentWillMount: function() {
    if (SessionHelper.hasTransactionsWithStatus("pending_start_receipt_review")) {
      this.setState({
        processing: true
      });
    }

    this.setState({
      games: [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' }
      ],
      selected: { value: 'one', label: 'One' },
      loaded: false,
      error: '',
      amount: ''
    });

    GameActions.retrieveGames();
  },
  componentDidMount: function() {
    GameStore.addChangeListener(this._onChange);

    Web3Store.addTransactionHashListener(this.onEvent_TransactionHash);
    Web3Store.addConfirmationListener(this.onEvent_Confirmation);
    Web3Store.addReceiptListener(this.onEvent_Receipt);
    Web3Store.addErrorListener(this.onEvent_Error);
  },
  componentWillUnmount: function() {
    GameStore.removeChangeListener(this._onChange);

    Web3Store.removeTransactionHashListener(this.onEvent_TransactionHash);
    Web3Store.removeConfirmationListener(this.onEvent_Confirmation);
    Web3Store.removeReceiptListener(this.onEvent_Receipt);
    Web3Store.removeErrorListener(this.onEvent_Error);
  },
  _onChange: function() {

    var dataStore = GameStore.getDataStore();

    var games = _.map(dataStore.list, function(item) {
      var game = {
        value: item.referenceHash,
        label: item.title
      };
      return game;
    });

    var selected = _.find(dataStore.list, function(game) {
      console.log(game.referenceHash, games[0].value);
      return game.referenceHash == games[0].value;
    });

    this.setState({
        games: games,
        value: games[0],
        referenceHash: selected.referenceHash,
        loaded: true,
        selected: games[0]
    });

    this.setState(GameStore.getDataStore());
  },
  onEvent_TransactionHash: function() {
    console.log("onEvent_TransactionHash");
  },
  onEvent_Confirmation: function() {
    console.log("onEvent_Confirmation");

    this.setState({
      loaded: true,
      processing: true
    });
  },
  onEvent_Receipt: function() {
    console.log("onEvent_Receipt");
  },
  onEvent_Error: function() {
    console.log("onEvent_Error");

    this.setState({
      loaded: true
    });

    this.forceUpdate();
  },
  forceUpdate() {
    // var dataStore = GameStore.getDataStore();
    //
    // var games = _.map(dataStore.list, function(item) {
    //   var game = {
    //     value: item.referenceHash,
    //     label: item.title
    //   };
    //   return game;
    // });
    //
    // var selected = _.find(dataStore.list, function(game) {
    //   console.log(game.referenceHash, games[0].value);
    //   return game.referenceHash == games[0].value;
    // });
    //
    // this.setState({
    //     games: games,
    //     value: games[0],
    //     referenceHash: selected.referenceHash,
    //     loaded: true,
    //     selected: games[0]
    // });

    this.setState(GameStore.getDataStore());
  },
  handleSelect(game) {
    console.log("handleSelect");
    console.log(game);

    this.setState({
      referenceHash: game.value,
      selected: game
    });
  },
  render() {
    const onChange = (event) => {
      console.log(event.target.value);

      this.setState({
        amount: event.target.value,
        error: ''
      });
    };

    var error = this.state.error;
    var loaded = this.state.loaded;
    var processing = this.state.processing;

    var transaction = SessionHelper.hasTransactionsWithStatus("pending_start_receipt_review");

    console.log(transaction);

    var queuedWagerId = -1;
    if (transaction) {
      queuedWagerId = transaction.wagerId;
    }

    const onSubmit = (event) => {

      event.preventDefault();

      console.log(this.state.amount);
      console.log(this.state.referenceHash);

      this.setState({
        loaded: false,
        error: ''
      });

      var amount = this.state.amount;

      if (!validator.isDecimal(amount)) {
        console.log("Incorrect amount");

        this.setState({
          loaded: true,
          error: 'Please enter correct amount.'
        });

        return;
      }

      amount = Number(amount);

      if (amount < 0.01) {
        console.log("Minimum bet is 0.01");

        this.setState({
          loaded: true,
          error: 'Please bet more than or equal to 0.01.'
        });

        return;
      }

      if (window.authorizedAccount === undefined) {
        this.setState({
          loaded: true,
          error: 'Please connect an account with balance first.'
        });
        return;
      }

      amount = window.web3.utils.toWei(amount.toString(), 'ether');
      const gas = 650000;
      const gasPrice = window.web3.utils.toWei("20", 'shannon');

      var params = {
        value: amount,
        from: window.authorizedAccount,
        gas: gas,
        gasPrice: gasPrice
      };

      console.log(params);

      console.log("PARAMS");
      console.log(this.state.referenceHash);

      var hash_sha3 = web3.utils.sha3(this.state.referenceHash);

      Web3Actions.startWager(hash_sha3, params);
    };

    return (
      <div>
        <div className="highlighted">Wager Details</div>
        <br />
        { loaded ? (
          <div>
            { processing ? (
              <div>
                <div className="highlighted-green">Congratulations! You have a wager in queue.</div>
                <div>Note: You will be able to start more wagers once the queue clears.</div>
                <div>Invite Id: <Link to={`/invites/${queuedWagerId}`} replace>{queuedWagerId}</Link></div>
                <br />
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <GameSelector onSelect={this.handleSelect} options={this.state.games} data={this.state.list} selected={this.state.selected} />

                <label>
                  <input type="text" placeholder="Enter Amount" value={this.state.amount} onChange={onChange} />
                </label>
                <br />
                <br />

                { error ? (
                  <div>
                    <div><input type="submit" value="Start Wager" /></div>
                    <br />
                    <div className="error">{this.state.error}</div>
                  </div>
                ) : (
                  <div><input type="submit" value="Start Wager" /></div>
                ) }

                <br />
              </form>
            ) }
          </div>
        ) : (
          <div>
            <Spinner intent={Intent.PRIMARY} />
            <div>Please wait...</div>
            <br />
          </div>
        ) }
      </div>
    );
  }
});

module.exports = Start;
