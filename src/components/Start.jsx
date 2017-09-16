import React from 'react';
import WagerStore from '../stores/WagerStore';
import Web3Actions from '../actions/Web3Actions';
import SwarmApi from '../utils/SwarmApi.js';

import GameSelector from '../components/GameSelector';

import TransactionHelper from "../helpers/TransactionUtils.js";
import SessionHelper from "../helpers/SessionUtils.js";

import { Intent, Spinner } from "@blueprintjs/core";

import "@blueprintjs/core/dist/blueprint.css";

var validator = require('validator');

import _ from 'lodash';

var Start = React.createClass({
  getInitialState: function() {
    return {
      loaded: true,
      error: '',
      amount: ''
    };
  },
  componentWillMount: function() {
    if (SessionHelper.hasTransactionsWithStatus("pending_start_receipt_review")) {
      this.setState({
        processing: true
      });
    }
  },
  componentDidMount: function() {
    this.setState({
      loaded: true,
      error: '',
      amount: ''
    });
  },
  componentWillUnmount: function() {
  },
  _onChange: function() {
  },
  handleSelect(game) {
    console.log("select");
    console.log(game);

    this.setState({
      referenceHash: game.value
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

    return (
      <div>
        { loaded ? (
          <div>
            <div className="highlighted">Wager Details</div>

            { processing ? (
              <div>
                <br />
                <div className="highlighted-green">Congratulations! You have a wager in queue.</div>
                <div>Note: You will be able to start more wagers once the queue clears.</div>
                <br />
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <br />

                <GameSelector onSelect={this.handleSelect} />

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
            <br />
          </div>
        ) }
      </div>
    );
  }
});

module.exports = Start;
