import React, { Component } from 'react';
import WagerStore from '../stores/WagerStore';
import Web3Store from '../stores/Web3Store';
import Web3Actions from '../actions/Web3Actions';
import Invite from '../components/Invite';
import Rules from '../components/Rules';
import EventLogs from '../components/EventLogs';

import SessionHelper from "../helpers/SessionUtils.js";

import WinnerSelector from '../components/WinnerSelector';

import Helpers from "../helpers/TransactionUtils.js";

import { Intent, Spinner } from "@blueprintjs/core/dist";

import "@blueprintjs/core/dist/blueprint.css";

import {
  Link,
  withRouter
} from 'react-router-dom'

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

var loading_captions = [
  "Pending Payment...",
  "Pending Confirmation..."
]

export default class Wager extends Component
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
    this.setState(WagerStore.get());

    Web3Actions.retrieveWager(this.props.match.params.id);

    var transaction = SessionHelper.hasTransactionsWithWagerId(this.props.match.params.id);

    if (transaction) {
      if(transaction.status == "pending_counter_receipt_review") {
        SessionHelper.updateTransaction(transaction.id, "status", "finished_counter_receipt_review");
      }
      if(transaction.status == "pending_winner_receipt_review") {
        SessionHelper.updateTransaction(transaction.id, "status", "finished_winner_receipt_review");
      }
      if(transaction.status == "pending_withrawal_receipt_review") {
        SessionHelper.updateTransaction(transaction.id, "status", "finished_withrawal_receipt_review");
      }
    }
  }
  componentDidMount()
  {
    this.setState({
      loaded: true
    });

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

    if (transaction)
    {
      if(transaction.status == "pending_start_receipt_review")
      {
        SessionHelper.updateTransaction(transaction.id, "status", "finished_start_receipt_review");
      }

      if (transaction.status == "pending_counter_receipt_review")
      {
        this.setState({
          processing: true
        });
      }
    }

    SessionHelper.listTransactions();
  }
  _onChange()
  {
    this.setState(WagerStore.get());
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
    const isWagerOpen = (this.state.wager.state === 'open') ;
    const isWagerClosed = (this.state.wager.state === 'closed');
    const isWagerFinished = (this.state.wager.state === 'finished');
    const isWagerSettled = (this.state.wager.state === 'settled');

    const hasPlayers = (this.state.wager.players !== undefined);

    var isWinner = false;
    var creator = "";

    var isPlayer = false

    if (hasPlayers)
    {
      isWinner = (this.state.wager.winner === window.authorizedAccount);
      creator = this.state.wager.players[0];

      isPlayer = (this.state.wager.players[0] === window.authorizedAccount || this.state.wager.players[1] === window.authorizedAccount);
    }

    var isLoser = false;

    if (hasPlayers)
    {
      if (!isWinner && this.state.wager.players.indexOf(window.authorizedAccount) != -1) {
        isLoser = true;
      }
    }

    if (!isWagerFinished && !isWagerSettled) {
      isLoser = false;
      isWinner = false;
    }

    var loaded = this.state.loaded;

    const onSubmit = (event) => {
      event.preventDefault();

      console.log(event.target.name);

      const gas = 650000;
      // const gasPrice = window.web3.utils.toWei(20, 'shannon');

      switch(event.target.name) {
        case 'windraw-winnings-form':

          this.setState({
            loaded: false,
            loading_caption: loading_captions[0]
          });

          var params = {
            from: window.authorizedAccount,
            gas: gas
          };

          console.log(params);

          Web3Actions.withdrawWinnings(this.props.match.params.id, params);

          break;
        case 'set-winner-form':
          console.log(event.target.winner.value);

          this.setState({
            loaded: false,
            loading_caption: loading_captions[0]
          });

          const winner = event.target.winner.value;
          // const amount = window.web3.utils.toWei(0.01, 'ether');

          var params = {
            from: window.authorizedAccount,
            gas: gas
          };

          console.log(params);

          Web3Actions.setWagerWinner(this.props.match.params.id, winner, params);

          break;
      }
    };

    const referenceHash = this.state.wager.referenceHash;
    const startTimestamp = this.state.wager.startTimestamp;

    var loaded = this.state.loaded;
    var processing = this.state.processing;

    var isModerator = false;
    if (window.authorizedAccount == window.host_WagerRegistrar)
    {
      isModerator = true;
    }

    return (
        <div>
          <div className="highlighted">Wager Terms</div>
          <br />
          <div>Wager Id: {this.state.wager.index}</div>
          <div>Start Time: {this.state.wager.date}</div>
          <div>

            {
              isPlayer ? (
                <div>
                  {
                    isWagerClosed ? (
                      <div>
                        funded
                      </div>
                    ) : (
                      <div>
                        {this.state.wager.state}
                      </div>
                    )
                  }
                </div>
              ) : (
                <div>
                    {this.state.wager.state}
                </div>
              )
            }
          </div>

          <div>Amount: {this.state.wager.amount / 1000000000000000000} Eth</div>

          <br />
          { referenceHash ? (
            <Rules referenceHash={referenceHash} startTimestamp={startTimestamp} />
          ) : (
            <Spinner intent={Intent.PRIMARY} />
          )}

          { isModerator ? (
            <div>
              <br />
              <div className="highlighted">Moderator Tools</div>
              <br />
              { loaded ? (
                <div>
                  { isWagerFinished ? (
                      <div>
                        <div>Wager Winner: {this.state.wager.winner}</div>
                      </div>
                    ) : (
                      <div>
                        { processing ? (
                          <div>
                            <br />
                            <div className="highlighted-green">You have set transaction winner.</div>
                            <div>Note: This message will disappear when the queue clears.</div>
                            <br />
                          </div>
                        ) : (
                          <div>
                          {
                            isWagerSettled ? (
                              <div>
                                <div>Wager Creator: {creator}</div>
                                <div>Wager Winner: {this.state.wager.winner}</div>
                              </div>
                            ) : (
                              <div>
                              {
                                isWagerOpen ? (
                                  <div>
                                    <div>Wager has not started.</div>
                                  </div>
                                ) : (
                                  <div>
                                    <div>
                                      <div>Wager Creator: {creator}</div>
                                      <br />
                                    </div>
                                    <div>
                                      <form name="set-winner-form" onSubmit={onSubmit}>
                                        <WinnerSelector onSelect={this.handleSelect} players={this.state.wager.players} />
                                        <div><input type="submit" value="Set Winner" /></div>
                                      </form>
                                    </div>
                                </div>
                                )
                              }
                              </div>
                            )
                          }
                          </div>
                        )}
                      </div>
                  )}
                </div>
              ) : (
                <div>
                  <Spinner intent={Intent.PRIMARY} />
                  <div>{this.state.loading_caption}</div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <br />
              {
                isWinner &&
                <div>
                  { loaded ? (
                    <div>
                      { !isWagerSettled &&
                        <div>
                          { processing ? (
                            <div>
                              <br />
                              <div className="highlighted-green">Congratulations! Your withdrawal is in queue.</div>
                              <div>Note: This message will disappear when the queue clears.</div>
                              <br />
                            </div>
                          ) : (
                            <div>
                              <div className="highlighted-green">Congratulations! You are the winner!</div>
                              <br />

                              <form name="windraw-winnings-form" onSubmit={onSubmit}>
                                <div><input type="submit" value="Withdraw Winnings" /></div>
                                <br />
                              </form>
                            </div>
                          )}
                        </div>
                      }

                      { isWagerSettled &&
                        <div>
                          <div className="highlighted-green">Congratulations! You are the winner!</div>
                          <br />
                        </div>
                      }
                    </div>
                  ) : (
                    <div>
                      <div>
                        <Spinner intent={Intent.PRIMARY} />
                        <div>{this.state.loading_caption}</div>
                      </div>
                      <br />
                    </div>
                  )}
                </div>
              }
              {
                isLoser &&
                <div>
                  <div className="highlighted-red">Sorry, you did not win.</div>
                  <br />
                  <div>Wager Winner: {this.state.wager.winner}</div>
                  <br />
                </div>
              }

              {
                isPlayer ? (
                  <div>

                    { isWagerClosed &&
                      <div>
                        <div className="highlighted-green">Waiting for game results...</div>
                        <br />
                      </div>
                    }

                    <HomeButton to="/" label="Start New Wager" />
                  </div>
                ) : (
                  <div>
                      <HomeButton to="/" label="Start Over" />
                  </div>
                )
              }

            </div>
          )}

          <br />
          <div className="highlighted">Related</div>

          <br />
          <div>Invite Id: <Link to={`/invites/${this.state.wager.index}`} replace>{this.state.wager.index}</Link></div>

          <br />
          <EventLogs index={this.props.match.params.id} />
        </div>
    );
  }
};

const HomeButton = withRouter(({ history, label, to }) => (
  <div>
    <button type="button" className="btn-secondary" onClick={() => history.push(to)} >
      {label}
    </button>
  </div>
));

// module.exports = Wager;
