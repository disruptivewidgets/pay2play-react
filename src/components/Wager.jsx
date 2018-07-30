import React, { Component } from 'react';

import Web3Actions from '../actions/Web3Actions';
import Invite from '../components/Invite';
import Rules from '../components/Rules';
import EventLogs from '../components/EventLogs';

import DiscordUserSelector from '../components/DiscordUserSelector';
import DiscordBotActions from '../actions/DiscordBotActions';

import DiscordBotStore from '../stores/DiscordBotStore';
import WagerStore from '../stores/WagerStore';
import Web3Store from '../stores/Web3Store';

import SessionHelper from "../helpers/SessionUtils.js";

import WinnerSelector from '../components/WinnerSelector';

import Formatter from "../helpers/Formatters.js";

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

export default class Wager extends Component {
  constructor(props) {
    super(props);
    this.handleSelect = this.handleSelect.bind(this);

    this.state = WagerStore.get();

    this._onChange = this._onChange.bind(this);

    this.onEvent_TransactionHash = this.onEvent_TransactionHash.bind(this);
    this.onEvent_Confirmation = this.onEvent_Confirmation.bind(this);
    this.onEvent_Receipt = this.onEvent_Receipt.bind(this);
    this.onEvent_Error = this.onEvent_Error.bind(this);

    this.onEvent_RetrievePlayers = this.onEvent_RetrievePlayers.bind(this);
  }
  componentWillMount() {
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
    DiscordBotActions.retrievePlayers(0);
  }
  componentDidMount() {
    this.setState({
      loaded: true
    });

    WagerStore.addChangeListener(this._onChange);

    DiscordBotStore.addRetrievePlayersListener(this.onEvent_RetrievePlayers);

    Web3Store.addTransactionHashListener(this.onEvent_TransactionHash);
    Web3Store.addConfirmationListener(this.onEvent_Confirmation);
    Web3Store.addReceiptListener(this.onEvent_Receipt);
    Web3Store.addErrorListener(this.onEvent_Error);
  }
  componentWillUnmount() {
    WagerStore.removeChangeListener(this._onChange);

    DiscordBotStore.removeRetrievePlayersListener(this.onEvent_RetrievePlayers);

    Web3Store.removeTransactionHashListener(this.onEvent_TransactionHash);
    Web3Store.removeConfirmationListener(this.onEvent_Confirmation);
    Web3Store.removeReceiptListener(this.onEvent_Receipt);
    Web3Store.removeErrorListener(this.onEvent_Error);
  }
  componentWillReceiveProps(nextProps) {

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
  _onChange() {
    this.setState(WagerStore.get());
  }
  onEvent_TransactionHash() {
    this.setState({
        loading_caption: loading_captions[1]
    });
  }
  onEvent_Confirmation() {
    this.setState({
      loaded: true,
      processing: true
    });
  }
  onEvent_Receipt() {
  }
  onEvent_Error() {
    this.setState({
      loaded: true
    });

    this.forceUpdate();
  }
  onEvent_RetrievePlayers() {
    let {
      wager
    } = this.state;

    let discordUsers = DiscordBotStore.getStore();

    discordUsers = discordUsers.users;

    let options = [];
    let option = {};

    if (discordUsers) {
      discordUsers = _.map(wager.players, function(address) {

        let player = _.find(discordUsers, (discordUser) => {
          return discordUser.ethereumAddress == address;
        });

        return player;
      });

      options = _.map(discordUsers, (player) => {
        var option = {
          value: player.ethereumAddress,
          label: `${player.discordUsername}#${player.discordDiscriminator}`
        };

        return option;
      });

      option = options[0];
    }

    this.setState({
      discordUsers,
      options_DiscordUsers: options,
      selected_DiscordUserOption: option
    });

    this.forceUpdate();
  }
  handleSelect(selector, value) {
    console.log('YO');

    if (selector === 'discord-user-selector') {
      console.log(value);
      console.log(value.value);

      this.setState({
        selected_DiscordUserOption: value
      });
    }
  }
  render() {
    let {
      discordUsers,
      options_DiscordUsers,
      selected_DiscordUserOption,
      wager
    } = this.state;

    console.log(' ===========> ', discordUsers);
    console.log(' ===========> ', options_DiscordUsers);
    console.log(' ===========> ', selected_DiscordUserOption);

    let hasDiscordUsers = false;

    if (discordUsers) {
      hasDiscordUsers = true;
    }

    const isWagerOpen = (wager.state === 'open') ;
    const isWagerClosed = (wager.state === 'closed');
    const isWagerFinished = (wager.state === 'finished');
    const isWagerSettled = (wager.state === 'settled');

    const hasPlayers = (wager.players !== undefined);

    var isWinner = false;
    var creator = "";

    var isPlayer = false

    if (hasPlayers) {
      isWinner = (wager.winner === window.authorizedAccount);
      creator = wager.players[0];

      isPlayer = (wager.players[0] === window.authorizedAccount || wager.players[1] === window.authorizedAccount);
    }

    var isLoser = false;

    if (hasPlayers) {
      if (!isWinner && wager.players.indexOf(window.authorizedAccount) != -1) {
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

          Web3Actions.withdrawWinnings(this.props.match.params.id, params);

          break;
        case 'set-winner-form':
          this.setState({
            loaded: false,
            loading_caption: loading_captions[0]
          });

          // let winner = event.target.winner.value;

          let winner = this.state.selected_DiscordUserOption.value;
          console.log(winner);

          // const amount = window.web3.utils.toWei(0.01, 'ether');

          var params = {
            from: window.authorizedAccount,
            gas: gas
          };

          Web3Actions.setWagerWinner(this.props.match.params.id, winner, params);

          break;
      }
    };

    const referenceHash = wager.referenceHash;
    const startTimestamp = wager.startTimestamp;

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
          <div>Wager Id: {wager.index}</div>
          <div>Start Time: {wager.date}</div>
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
                        {wager.state}
                      </div>
                    )
                  }
                </div>
              ) : (
                <div>
                    {wager.state}
                </div>
              )
            }
          </div>

          <div>Amount: {wager.amount / 1000000000000000000} Eth</div>

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
                        <div>Wager Winner: {Formatter.formatAddress(wager.winner)}</div>
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
                                <div>Wager Creator: {Formatter.formatAddress(creator)}</div>
                                <div>Wager Winner: {Formatter.formatAddress(wager.winner)}</div>
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
                                      <div>Wager Creator: {Formatter.formatAddress(creator)}</div>
                                      <br />
                                    </div>
                                    <div>
                                      <form name="set-winner-form" onSubmit={onSubmit}>
                                        {/* <WinnerSelector onSelect={this.handleSelect} players={this.state.wager.players} /> */}
                                        {
                                          hasDiscordUsers &&
                                          <div>
                                            <DiscordUserSelector
                                              onSelect={this.handleSelect}
                                              data={discordUsers}
                                              options={options_DiscordUsers}
                                              selected={selected_DiscordUserOption}
                                            />
                                          </div>
                                        }
                                        <br />
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
                  <div>Wager Winner: {Formatter.formatAddress(wager.winner)}</div>
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
          <div>Invite Id: <Link to={`/invites/${wager.index}`} replace>{wager.index}</Link></div>

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
