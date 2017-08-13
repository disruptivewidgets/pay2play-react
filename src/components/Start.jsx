import React from 'react';
import WagerStore from '../stores/WagerStore';
import Web3Actions from '../actions/Web3Actions';
import SwarmApi from '../utils/SwarmApi.js';

import GameSelector from '../components/GameSelector';

import Helpers from "../helpers/TransactionUtils.js";

var Start = React.createClass({
  getInitialState: function() {
    return {
      loaded: true
    };
  },
  componentWillMount: function() {
    this.setState({
      loaded: true
    });

    // this.setState(CheckoutStore.getDataStore());
    // SwarmApi.getGames();
  },
  componentDidMount: function() {
    // CheckoutStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    // CheckoutStore.removeChangeListener(this._onChange);
  },
  _onChange: function() {

    // console.log(CheckoutStore.getDataStore());

    // this.setState(CheckoutStore.getDataStore());
  },
  render() {
    const onSubmit = (event) => {

      event.preventDefault();
      console.log(window.web3.version);

      const amount = window.web3.utils.toWei(0.01, 'ether');
      const gas = 650000;
      const gasPrice = window.web3.utils.toWei(20, 'shannon');

      var params = {
        value: amount,
        from: window.authorizedAccount,
        gas: gas,
        gasPrice: gasPrice
      };
      console.log(params);

      // var hash = this.state.hash;
      //
      // console.log("hash", hash);
      // console.log(typeof(this.state.hash));
      //
      // hash = 'd3ba5f21813ef1002930ba5c0c01f2f54236717e1f7a254354ac81a7d0bbfd53';

      window.contract.methods.createWagerAndDeposit(this.state.hash).send(params, Helpers.getTxHandler({
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
        <GameSelector />
        <form onSubmit={onSubmit}>
          <label>
            <input type="text" placeholder="Enter Amount" value={this.state.hash} />
          </label>
          <br />
          <br />
          <input type="submit" value="Start Wager" />
        </form>
        <br />
      </div>
    );
  }
});

module.exports = Start;
