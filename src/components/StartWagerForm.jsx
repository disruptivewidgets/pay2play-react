import React, {Component} from 'react';

import GameStore from '../stores/GameStore';
import GameActions from '../actions/GameActions';

import { Intent, Spinner, DatePickerFactory } from "@blueprintjs/core";

import TransactionHelper from "../helpers/TransactionUtils.js";
import SessionHelper from "../helpers/SessionUtils.js";

import "@blueprintjs/core/dist/blueprint.css";

import _ from 'lodash';

import Select from 'react-select';

// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css';

var StartWagerForm = React.createClass({
  getInitialState: function() {
    return GameStore.getDataStore();
  },
  componentWillMount: function() {
    this.setState(GameStore.getDataStore());

    GameActions.retrieveGames();

    if (SessionHelper.hasTransactionsWithStatus("pending_start_receipt_review")) {
      this.setState({
        processing: true
      });
    }

    this.setState({
      loaded: true,
      error: '',
      amount: ''
    });

  },
  componentDidMount: function() {
    this.setState({
      games: [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' }
      ],
      value: "one",
      loaded: false,
      error: ''
    });

    this.props.onLoadStart();

    GameStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    console.log("componentWillUnmount");

    GameStore.removeChangeListener(this._onChange);
  },
  _onChange: function() {
    console.log("here");

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
        loaded: true,
        selected: selected
    });

    this.props.onLoadFinish();

    this.props.onSelect(games[0]);

    this.setState(GameStore.getDataStore());
  },
  render: function() {
    const onChange = (value) => {
      console.log("Selected: " + JSON.stringify(value));

      var selected = _.find(this.state.list, function(game) {
        return game.referenceHash == value.value;
      });

      this.setState({
          selected: selected,
          value: value
      });

      this.props.onSelect(value);
    };

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

      amount = window.web3.utils.toWei(0.01, 'ether');
      const gas = 650000;
      const gasPrice = window.web3.utils.toWei(20, 'shannon');

      var params = {
        value: amount,
        from: window.authorizedAccount,
        gas: gas,
        gasPrice: gasPrice
      };

      console.log(params);

      window.contract.methods.createWagerAndDeposit(this.state.referenceHash).send(params, TransactionHelper.getTxHandler({
          onStart: (txid) => {
            console.log("onStart");
            console.log("txid: " + txid);

            var transaction = {
              id: txid,
              status: "pending_block",
              type: "start",
              wagerId: -1
            }

            SessionHelper.storeTransaction(transaction);
            SessionHelper.listTransactions();
          },
          onDone: () => {
            console.log("onDone");
          },
          onSuccess: (txid, receipt) => {
            console.log("onSuccess");
            console.log(txid);
            console.log(receipt);

            var logs = receipt.logs;

            var log = logs[0];

            var topics = log.topics;

            var topic = topics[1];

            var wagerId = window.web3.utils.hexToNumber(topic);

            SessionHelper.updateTransaction(txid, "status", "pending_start_receipt_review");
            SessionHelper.updateTransaction(txid, "wagerId", wagerId);
            SessionHelper.listTransactions();

            // console.log(SessionHelper.hasTransactionsWithStatus("pending_start_receipt_review"));

            this.setState({
              loaded: true,
              processing: true
            });
          },
          onError: (error) => {
            console.log("onError");

            this.setState({
              loaded: true
            });
          }
        })
      );
    };

    var loaded = this.state.loaded;
    var error = this.state.error;
    var processing = this.state.processing;

    return (
      <div>
        <form onSubmit={onSubmit}>
          <br />
            <div>
              { processing ? (
                <div>
                  <br />
                  <div className="highlighted-green">Congratulations! You have a wager in queue.</div>
                  <div>Note: You will be able to start more wagers once the queue clears.</div>
                  <br />
                </div>
              ) : (
                <div>
                  { this.state.selected &&
                    <div>
                      <Select
                        addLabelText='Select Game'
                        name="form-field-name"
                        options={this.state.games}
                        onChange={onChange}
                        value={this.state.value}
                        clearable={false}
                        cache={false}
                        searchable={false}
                      />

                      <br />
                      <GameItem
                        key={this.state.selected.id}
                        item={this.state.selected}
                      />
                    </div>
                  }

                  <br />
                  <label>
                    <input type="text" placeholder="Enter Amount" value={this.state.amount} onChange={this.props.onAmountInput} />
                  </label>
                  <br />
                  <br />
                </div>
            ) }
          </div>

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
      </div>
    );
  }
});

function GameItem(props) {
  const {item} = props;
  return (
    <div>
      <label>
        Rules Hash: {item.referenceHash}
      </label>
      <br />
      <label>
        Effective Timeframe: {item.timeframe}
      </label>
    </div>
  );
}

module.exports = StartWagerForm;
