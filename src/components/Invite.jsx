import React, { Component } from 'react';

import {
  Link,
  withRouter
} from 'react-router-dom'

import Rules from '../components/Rules';
import EventLogs from '../components/EventLogs';
import WagerStore from '../stores/WagerStore';
import Web3Store from '../stores/Web3Store';
import Web3Actions from '../actions/Web3Actions';
import GameActions from '../actions/GameActions';
import EventLogStore from '../stores/EventLogStore';

import SessionHelper from "../helpers/SessionUtils.js";

import _ from 'lodash';

import Helpers from "../helpers/TransactionUtils.js";

import Formatter from "../helpers/Formatters.js";

import { Intent, Spinner } from "@blueprintjs/core/dist";

import "@blueprintjs/core/dist/blueprint.css";

var loading_captions = [
  "Pending Payment...",
  "Pending Confirmation..."
]

export default class Invite extends Component
{
  constructor(props)
  {
    super(props);
    this.state = WagerStore.get();
    this._onChange = this._onChange.bind(this);
    this.onEvent_TransactionHash = this.onEvent_TransactionHash.bind(this);
    this.onEvent_Confirmation = this.onEvent_Confirmation.bind(this);
    this.onEvent_Receipt = this.onEvent_Receipt.bind(this);
    this.onEvent_Error = this.onEvent_Error.bind(this);
  }
  componentWillMount()
  {
    console.log("componentWillMount");

    this.setState(WagerStore.get());
    this.setState(Web3Store.getStore());

    this.setState({
      loaded: true,
      error: ''
    });

    Web3Actions.retrieveWager(this.props.match.params.id);
    Web3Actions.getAccounts();

    var transaction = SessionHelper.hasTransactionsWithWagerId(this.props.match.params.id.toString());

    if (transaction) {
      if(transaction.status == "pending_start_receipt_review") {
        SessionHelper.updateTransaction(transaction.id, "status", "finished_start_receipt_review");
      }

      if (transaction.status == "pending_counter_receipt_review") {
        this.setState({
          processing: true
        });
      }
    }

    SessionHelper.listTransactions();
  }
  componentDidMount()
  {
    WagerStore.addChangeListener(this._onChange);

    Web3Store.addTransactionHashListener(this.onEvent_TransactionHash);
    Web3Store.addConfirmationListener(this.onEvent_Confirmation);
    Web3Store.addReceiptListener(this.onEvent_Receipt);
    Web3Store.addErrorListener(this.onEvent_Error);
  }
  componentWillUnmount()
  {
    WagerStore.removeChangeListener(this._onChange);

    Web3Store.removeTransactionHashListener(this.onEvent_TransactionHash);
    Web3Store.removeConfirmationListener(this.onEvent_Confirmation);
    Web3Store.removeReceiptListener(this.onEvent_Receipt);
    Web3Store.removeErrorListener(this.onEvent_Error);
  }
  componentWillReceiveProps(nextProps)
  {
    console.log("componentWillReceiveProps");

    this.setState({
      loaded: true,
      error: ''
    });

    Web3Actions.retrieveWager(nextProps.match.params.id);
    Web3Actions.getAccounts();

    var transaction = SessionHelper.hasTransactionsWithWagerId(nextProps.match.params.id.toString());

    if (transaction) {
      if(transaction.status == "pending_start_receipt_review") {
        SessionHelper.updateTransaction(transaction.id, "status", "finished_start_receipt_review");
      }

      if (transaction.status == "pending_counter_receipt_review") {
        this.setState({
          processing: true
        });
      }
    }

    SessionHelper.listTransactions();
    // this.forceUpdate();
  }
  _onChange()
  {
    this.setState(WagerStore.get());
    this.setState(Web3Store.getStore());

    this.setState({
      players: this.state.wager.players
    });
  }
  onEvent_TransactionHash()
  {
    console.log("onEvent_TransactionHash");

    this.setState({
        loading_caption: loading_captions[1]
    });
  }
  onEvent_Confirmation()
  {
    console.log("onEvent_Confirmation");

    this.setState({
      loaded: true,
      processing: true
    });
  }
  onEvent_Receipt()
  {
    console.log("onEvent_Receipt");
  }
  onEvent_Error()
  {
    console.log("onEvent_Error");

    this.setState({
      loaded: true
    });

    this.forceUpdate();
  }
  render()
  {
    const referenceHash = this.state.wager.referenceHash;

    const startTimestamp = this.state.wager.startTimestamp;
    const isWagerOpen = (this.state.wager.state === 'open') ;
    const hasPlayers = (this.state.wager.players !== undefined);
    const isAuthorized = (window.authorizedAccount !== undefined);

    var isOwnerLoggedIn = false;

    var showCallToAction = false;

    if (hasPlayers)
    {
      isOwnerLoggedIn = (this.state.wager.players[0] === window.authorizedAccount);
    }

    if (isOwnerLoggedIn)
    {
      showCallToAction = true;
    }

    var error = this.state.error;
    var loaded = this.state.loaded;
    var processing = this.state.processing;

    const onSubmit = (event) => {

      event.preventDefault();

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

      const amount = this.state.wager.amount;
      const gas = 650000;
      const gasPrice = window.web3.utils.toWei("20", 'shannon');

      var params = {
        value: amount,
        from: window.authorizedAccount,
        gas: gas,
        gasPrice: gasPrice
      };

      console.log(params);

      Web3Actions.counterWagerAndDeposit(this.props.match.params.id, params);

      // // NEW
      // window.component = this;
      // window.contract.methods.counterWagerAndDeposit(this.props.match.params.id).send(params)
      // .on('transactionHash', function(hash) {
      //   console.log("transactionHash");
      //   console.log("txid: " + hash);
      //
      //   SessionHelper.removeTransaction("wagerId", window.component.props.match.params.id);
      //
      //   var transaction = {
      //     id: hash,
      //     status: "pending_block",
      //     type: "counter",
      //     wagerId: this.props.match.params.id
      //   }
      //
      //   SessionHelper.storeTransaction(transaction);
      //   SessionHelper.listTransactions();
      // })
      // .on('confirmation', function(confirmationNumber, receipt) {
      //   console.log(confirmationNumber);
      //   console.log(receipt);
      //
      //   if (confirmationNumber == 0) {
      //     var hash = receipt.transactionHash;
      //
      //     SessionHelper.updateTransaction(hash, "status", "pending_counter_receipt_review");
      //     SessionHelper.listTransactions();
      //
      //     window.component.setState({
      //       loaded: true,
      //       processing: true
      //     });
      //   }
      // })
      // .on('receipt', function(receipt) {
      //   console.log("receipt");
      //   console.log(receipt)
      // })
      // .on('error', function(error) {
      //   console.log("error");
      //   console.error(error);
      //
      //   window.component.setState({
      //     loaded: true
      //   });
      //
      //   window.component.forceUpdate();
      // });
      // // OLD
      // // window.contract.methods.counterWagerAndDeposit(this.props.match.params.id).send(params, Helpers.getTxHandler({
      // //     onStart: (txid) => {
      // //       console.log("onStart");
      // //       console.log("txid: " + txid);
      // //
      // //       SessionHelper.removeTransaction("wagerId", this.props.match.params.id);
      // //
      // //       var transaction = {
      // //         id: txid,
      // //         status: "pending_block",
      // //         type: "counter",
      // //         wagerId: this.props.match.params.id
      // //       }
      // //
      // //       SessionHelper.storeTransaction(transaction);
      // //       SessionHelper.listTransactions();
      // //     },
      // //     onDone: () => {
      // //       console.log("onDone");
      // //     },
      // //     onSuccess: (txid, receipt) => {
      // //       console.log("onSuccess");
      // //       console.log(txid);
      // //       console.log(receipt);
      // //
      // //       var logs = receipt.logs;
      // //
      // //       var log = logs[0];
      // //
      // //       var topics = log.topics;
      // //
      // //       var topic = topics[1];
      // //
      // //       var wagerId = window.web3.utils.hexToNumber(topic);
      // //
      // //       SessionHelper.updateTransaction(txid, "status", "pending_counter_receipt_review");
      // //       SessionHelper.listTransactions();
      // //
      // //       this.setState({
      // //         loaded: true,
      // //         processing: true
      // //       });
      // //     },
      // //     onError: (error) => {
      // //       console.log("onError");
      // //
      // //       this.setState({
      // //         loaded: true
      // //       });
      // //     }
      // //   })
      // // );
    };

    return (
      <div>
        <div className="highlighted">Wager Invite</div>
        <br />
        { loaded ? (
          <div>
            <div>Wager Id: <Link to={`/wagers/${this.state.wager.index}`} replace>{this.state.wager.index}</Link></div>
            <div>Start Time: {this.state.wager.date}</div>
            <div>Amount: {this.state.wager.amount / 1000000000000000000} Eth</div>

            <br />
            { referenceHash ? (
              <Rules referenceHash={referenceHash} startTimestamp={startTimestamp} />
            ) : (
              <Spinner intent={Intent.PRIMARY} />
            )}

            <br />
            { hasPlayers ? (
              <div>
                <div className="highlighted">Players</div>
                <br />

                {this.state.wager.players.map(address => (
                  <Player
                    key={address}
                    player={address}
                    winner={this.state.wager.winner}
                    accounts={this.state.accounts}
                  />
                ))}
              </div>
            ) : (
              <Spinner intent={Intent.PRIMARY} />
            )}

            { showCallToAction && isWagerOpen &&
              <div>
                <br />
                <div className="highlighted-green">Share this invite with your opponent or wait for someone to counter.</div>
              </div>
            }

            <br />
            { isWagerOpen && !isOwnerLoggedIn && isAuthorized &&
              <div>
                { processing ? (
                  <div>
                    <br />
                    <div className="highlighted-green">Congratulations! Your counter is in queue.</div>
                    <div>Note: This message will disappear when the queue clears.</div>
                    <br />
                  </div>
                ) : (
                  <form onSubmit={onSubmit}>
                    { error ? (
                      <div>
                        <div><input type="submit" value="counter Wager" /></div>
                        <br />
                        <div className="error">{this.state.error}</div>
                      </div>
                    ) : (
                      <div><input type="submit" value="Counter Wager" /></div>
                    ) }
                    <br />
                  </form>
                )}
              </div>
            }

            <HomeButton to="/" label="Start Over" />
          </div>
        ) : (
          <div>
            <Spinner intent={Intent.PRIMARY} />
            <div>{this.state.loading_caption}</div>
          </div>
        ) }

        <br />
        <EventLogs index={this.props.match.params.id} />
      </div>
    );
  }
};

function Player(props)
{
  const player = props.player;
  const winner = props.winner;
  const accounts = props.accounts;

  var element = <div>{Formatter.formatAddress(player)}</div>;

  if (accounts.length > 0) {
    if (accounts[0] == player) {
      element = <div>{Formatter.formatAddress(player)} (You)</div>
    }
  };

  return (
    <div>
      {element}
    </div>
  );
}

const HomeButton = withRouter(({ history, label, to }) => (
  <div>
    <button type="button" className="btn-secondary" onClick={() => history.push(to)} >
      {label}
    </button>
  </div>
));
// module.exports = Invite;
