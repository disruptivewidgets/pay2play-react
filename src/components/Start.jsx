import React from 'react';
import WagerStore from '../stores/WagerStore';
import Web3Actions from '../actions/Web3Actions';

import {
  Link,
  Route,
  HashRouter as Router,
} from 'react-router-dom'

import Helpers from "../helpers/TransactionUtils.js";

var Loader = require('react-loader');

var Start = React.createClass({
  getInitialState: function() {
    console.log(this.props.match.params);
    return {};
  },
  componentWillMount: function() {
    this.setState({
      loaded: true
    });
    // this.setState(CheckoutStore.getDataStore());
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
    var options = {
        lines: 12,
        length: 5,
        width: 3,
        radius: 8,
        scale: 1.00,
        corners: 1,
        color: '#000',
        opacity: 0.25,
        rotate: 0,
        direction: 1,
        speed: 1,
        trail: 60,
        fps: 20,
        zIndex: 2e9,
        top: '50%',
        left: '50%',
        shadow: false,
        hwaccel: false,
        position: 'relative'
    };

    // const onChange = (event) => {
    //     this.setState({value: event.target.value});
    // };

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
        <p className="highlighted">Payment</p>

        <Loader loaded={this.state.loaded} options={options} parentClassName="orderFormLoader">
          <form onSubmit={onSubmit}>
            <label>
              <input type="text" placeholder="Enter Amount" value={this.state.hash} />
            </label>
            <br />
            <br />
            <input type="submit" value="Start Wager" />
          </form>
        </Loader>
    </div>
    );
  }
});

module.exports = Start;
