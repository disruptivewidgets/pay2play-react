import React from 'react';
import WagerStore from '../stores/WagerStore';
import Web3Actions from '../actions/Web3Actions';
import SwarmApi from '../utils/SwarmApi.js';

import GameSelector from '../components/GameSelector';

import Helpers from "../helpers/TransactionUtils.js";

import { Intent, Spinner } from "@blueprintjs/core";

import "@blueprintjs/core/dist/blueprint.css";

var validator = require('validator');

var Start = React.createClass({
  getInitialState: function() {
    return {
      loaded: true,
      error: '',
      amount: ''
    };
  },
  componentWillMount: function() {
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

    var loaded = this.state.loaded;
    var error = this.state.error;

    const onSubmit = (event) => {

      event.preventDefault();

      console.log(this.state.amount);
      console.log(this.state.referenceHash);

      console.log(window.web3.version);

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

      window.contract.methods.createWagerAndDeposit(this.state.referenceHash).send(params, Helpers.getTxHandler({
          onDone: () => {
            console.log("onDone");
          },
          onSuccess: (txid, receipt) => {
            console.log("onSuccess");
            console.log(txid, receipt);
            this.setState({
              loaded: true
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
          <form onSubmit={onSubmit}>
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
