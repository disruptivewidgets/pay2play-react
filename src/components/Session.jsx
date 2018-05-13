import React from 'react';

import CacheActions from '../actions/CacheActions';
import CacheStore from '../stores/CacheStore';

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

var Session = React.createClass({
  getInitialState: function()
  {
    return CacheStore.getDataStore();
  },
  componentWillMount: function()
  {
    if (SessionHelper.hasTransactionsWithStatus("pending_start_receipt_review")) {
      this.setState({
        processing: true
      });
    }

    this.setState({
      loaded: true
    });

    console.log(SessionHelper.getTransactions());
    //
    CacheActions.retrieveTransactions();

  },
  componentDidMount: function()
  {
    CacheStore.addChangeListener(this._onChange);
    //
    // Web3Store.addTransactionHashListener(this.onEvent_TransactionHash);
    // Web3Store.addConfirmationListener(this.onEvent_Confirmation);
    // Web3Store.addReceiptListener(this.onEvent_Receipt);
    // Web3Store.addErrorListener(this.onEvent_Error);
  },
  componentWillUnmount: function()
  {
    CacheStore.removeChangeListener(this._onChange);
    //
    // Web3Store.removeTransactionHashListener(this.onEvent_TransactionHash);
    // Web3Store.removeConfirmationListener(this.onEvent_Confirmation);
    // Web3Store.removeReceiptListener(this.onEvent_Receipt);
    // Web3Store.removeErrorListener(this.onEvent_Error);
  },
  _onChange: function()
  {

    var dataStore = CacheStore.getDataStore();

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

    this.setState(CacheStore.getDataStore());
  },
  render() {
    var loaded = this.state.loaded;

    return (
      <div>
        <div className="highlighted">Session</div>
        <br />
        <div>Below is the list of pending transactions. These transactions have not made it in to the blockchain.</div>
        <br />
        { loaded ? (
          <div>
            <p className="highlighted">Cached Records</p>

            {
              this.state.list.length > 0 &&
                <table className="wagers">
                  <thead>
                    <tr>
                      <td>
                        Id
                      </td>
                      <td>
                        TxId
                      </td>
                      <td>
                        Status
                      </td>
                      <td>
                        Type
                      </td>
                      <td>
                        WagerId
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.list.map(item => (
                      <CacheRecordItem
                        key={item.id}
                        item={item}
                      />
                    ))}
                  </tbody>
                </table>
            }

            {
              this.state.list.length == 0 &&
                <div> No records</div>
            }

            <br />
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

module.exports = Session;
