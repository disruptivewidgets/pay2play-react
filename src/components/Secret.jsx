import React from 'react';

import Web3Store from '../stores/Web3Store';
import Web3Actions from '../actions/Web3Actions';

import { Intent, Spinner } from "@blueprintjs/core/dist";

import "@blueprintjs/core/dist/blueprint.css";

var validator = require('validator');

import {
  Link,
  withRouter
} from 'react-router-dom'

import _ from 'lodash';

var loading_captions = [
  "Pending Payment...",
  "Pending Confirmation..."
]

var Secret = React.createClass({
  getInitialState: function()
  {
    return {
      secretHash: "None",
      secret: ""
    };
  },
  componentWillMount: function()
  {
    console.log(window.authorizedAccount);

    window.web3.eth.getAccounts((err, accounts) => {
      if (err || !accounts || accounts.length == 0) return;
      Web3Actions.getSecretHash(accounts[0]);
    });

    this.setState({
      loaded: true
    });
  },
  componentDidMount: function()
  {
    console.log("YO" + window.authorizedAccount);
    Web3Store.addTransactionHashListener(this.onEvent_TransactionHash);
    Web3Store.addConfirmationListener(this.onEvent_Confirmation);
    Web3Store.addReceiptListener(this.onEvent_Receipt);
    Web3Store.addErrorListener(this.onEvent_Error);
    Web3Store.addSecretHashListener(this.onEvent_SecretHash);
  },
  componentWillUnmount: function()
  {
    Web3Store.removeTransactionHashListener(this.onEvent_TransactionHash);
    Web3Store.removeConfirmationListener(this.onEvent_Confirmation);
    Web3Store.removeReceiptListener(this.onEvent_Receipt);
    Web3Store.removeErrorListener(this.onEvent_Error);
    Web3Store.removeSecretHashListener(this.onEvent_SecretHash);
  },
  _onChange: function()
  {
  },
  onEvent_TransactionHash: function()
  {
    console.log("onEvent_TransactionHash");

    this.setState({
        loading_caption: loading_captions[1]
    });
  },
  onEvent_Confirmation: function()
  {
    console.log("onEvent_Confirmation");

    this.setState({
      loaded: true,
      processing: true
    });
  },
  onEvent_Receipt: function()
  {
    console.log("onEvent_Receipt");
  },
  onEvent_Error: function()
  {
    console.log("onEvent_Error");

    this.setState({
      loaded: true
    });

    this.forceUpdate();
  },
  onEvent_SecretHash: function() {
    console.log("onEvent_SecretHash");

    this.setState({
      secretHash: window.secretHash
    });
  },
  render()
  {
    const onChange = (event) =>
    {
      // console.log(event.target.value);

      this.setState({
        secret: event.target.value,
        error: ''
      });
    };

    var error = this.state.error;
    var loaded = this.state.loaded;

    const onSubmit = (event) => {

      event.preventDefault();
      console.log(this.state.secret);

      if (this.state.secret == undefined || this.state.secret == "") {
        console.log("Invalid secret");

        this.setState({
          loaded: true,
          error: 'Please enter your secret.'
        });

        return;
      }

      this.setState({
        loaded: false,
        error: '',
        loading_caption: loading_captions[0]
      });

      if (window.authorizedAccount === undefined) {
        this.setState({
          loaded: true,
          error: 'Please connect an account with balance first.'
        });
        return;
      }

      // amount = window.web3.utils.toWei(amount.toString(), 'ether');
      const gas = 650000;
      const gasPrice = window.web3.utils.toWei("20", 'shannon');

      var params = {
        from: window.authorizedAccount,
        gas: gas,
        gasPrice: gasPrice
      };

      var secret = window.web3.utils.fromAscii(this.state.secret);

      Web3Actions.setSecret(secret, params);

    };

    return (
      <div>
        <div className="highlighted">Network Access</div>
        <br />
        <div>Secret Hash: {this.state.secretHash}</div>
        <br />

        { loaded ? (
          <div>
            <form onSubmit={onSubmit}>
              <label>
                <input type="text" placeholder="Secret Word" value={this.state.secret} onChange={onChange} />
              </label>
              <br />
              <br />

              { error ? (
                <div>
                  <div><input type="submit" value="Set Secret" /></div>
                  <br />
                  <div className="error">{this.state.error}</div>
                </div>
              ) : (
                <div><input type="submit" value="Set Secret" /></div>
              ) }
              <br />
            </form>
          </div>
        ) : (
          <div>
            <Spinner intent={Intent.PRIMARY} />
            <div>{this.state.loading_caption}</div>
            <br />
          </div>
        ) }
      </div>
    );
  }
});

function CacheRecordItem(props) {
  const {item} = props;

  var style = "";

  return (
    <tr className={style}>
      <td>
        {item.id}
      </td>
      <td>
        {item.txnId}
      </td>
      <td>
        {item.status}
      </td>
      <td>
        {item.type}
      </td>
      <td>
        {item.wagerId}
      </td>
    </tr>
  );
}

module.exports = Secret;
