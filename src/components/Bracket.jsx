import React from 'react';

import BracketStore from '../stores/BracketStore';
import Web3Actions from '../actions/Web3Actions';

import WinnerSelector from '../components/WinnerSelector';

import { Intent, Spinner } from "@blueprintjs/core/dist";

import "@blueprintjs/core/dist/blueprint.css";

import _ from 'lodash';

var data_A = [
  '0',
  '0', '0',
  '0', '0', '0', '0',
  '0', '0', '0', '0', '0', '0', '0', '0',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'
];

var data_B = [
  '0',
  '0', '0',
  '0', '0', '0', '0',
  '0', '0', '0', '0', '0', '0', '0', '0',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'
]

function fill_SideA(playerCount, data)
{
  var values = [];

  for (var i = 0; i < data.length; i += 1)
  {
    values.push(
      {
        index: i,
        value: data[i]
      }
    )
  }

  var depth = 0;
  var nodeCount = playerCount;

  var breakdown = [];

  while(values.length > 0)
  {
    var column = [];
    for (var i = 0; i < nodeCount; i += 1)
    {
      var value = values.pop();
      column.push(value);
    }

    nodeCount = nodeCount / 2;

    depth += 1;
    breakdown.push(column);
  }

  var grid = [];

  for (var i = 0; i < depth; i += 1)
  {
    var row = breakdown[i];

    var shim = [];

    for (var n = 0; n < 2**i - 1; n += 1)
    {
      shim.push("X");
    }

    row = _.flatMap(row, (value, index, array) =>
       array.length -1 !== index ? [value].concat(shim) : value
    );

    row = row.concat(shim);

    grid.push(row);
  }

  var grid = _.zip.apply(_, grid);

  return grid;
}

function fill_SideB(playerCount, data)
{
  var values = [];

  for (var i = 0; i < data.length; i += 1)
  {
    values.push(
      {
        index: i,
        value: data[i]
      }
    )
  }
  var depth = 0;
  var nodeCount = playerCount;

  var breakdown = [];

  while(values.length > 0)
  {
    var column = [];
    for (var i = 0; i < nodeCount; i += 1)
    {
      var value = values.pop();
      column.push(value);
    }

    nodeCount = nodeCount / 2;

    depth += 1;
    breakdown.push(column);
  }

  var grid = [];

  for (var i = 0; i < depth; i += 1)
  {
    var row = breakdown[i];

    var shim = [];

    for (var n = 0; n < 2**i - 1; n += 1)
    {
      shim.push("X");
    }

    row = _.flatMap(row, (value, index, array) =>
       array.length -1 !== index ? [value].concat(shim) : value
    );

    row = row.concat(shim);

    grid.push(row);
  }

  grid = grid.reverse();

  var grid = _.zip.apply(_, grid);

  return grid;
}

function count_SideA(grid)
{
  var transpose = _.zip.apply(null, grid);

  console.log(transpose);

  var length = transpose.length;
  var address = "";
  var counts = {};

  for (var n = 0; n < transpose[0].length; n += 1)
  {
    address = transpose[0][n].value;

    if (address != "0x0000000000000000000000000000000000000000")
    {
        counts[address] = 0;
    }

    for (var i = 0; i < length; i += 1)
    {
      if (address != "0x0000000000000000000000000000000000000000")
      {
        var matches = _.filter(transpose[i], function(match) {
          return match.value == address;
        });

        if (matches.length > 0)
        {
          counts[address] += 1;
        }
      }
    }
  }

  console.log("counts", counts);

  return counts;
}

function count_SideB(grid)
{
  var transpose = _.zip.apply(null, grid);

  console.log(transpose);

  var length = transpose.length;
  var address = "";
  var counts = {};

  for (var n = transpose[length - 1].length - 1; n >= 0; n -= 1)
  {
    address = transpose[length - 1][n].value;

    if (address != "0x0000000000000000000000000000000000000000")
    {
        counts[address] = 0;
    }

    for (var i = length - 1; i >= 0; i -= 1)
    {
      if (address != "0x0000000000000000000000000000000000000000")
      {
        var matches = _.filter(transpose[i], function(match) {
          return match.value == address;
        });

        if (matches.length > 0)
        {
          counts[address] += 1;
        }
      }
    }
  }

  console.log("counts", counts);

  return counts;
}

var ACTION_NONE = "none";

var ACTION_FILL_SEAT_SIDE_A = 'fillSeat_SideA';
var ACTION_FILL_SEAT_SIDE_B = 'fillSeat_SideB';

var ACTION_PROMOTE_PLAYER_SIDE_A = 'promotePlayer_SideA';
var ACTION_PROMOTE_PLAYER_SIDE_B = 'promotePlayer_SideB';

var ACTION_SET_WINNER = 'setWinner';

var loading_captions =
[
  "Pending Bracket Data...",
  "Pending Payment...",
  "Pending Confirmation..."
]

var Bracket = React.createClass({
  getInitialState: function()
  {
    return {
      playerCount: 32,
      seatsData_SideA: BracketStore.getSeats_SideA(),
      seatsData_SideB: BracketStore.getSeats_SideB(),
      userAction: ACTION_NONE
    };
  },
  componentWillMount: function()
  {
    var grid_SideA = fill_SideA(this.state.playerCount, data_A);
    var grid_SideB = fill_SideB(this.state.playerCount, data_B);

    this.setState({
      bracket_SideA: grid_SideA,
      bracket_SideB: grid_SideB,
      winner_SideA: '',
      winner_SideB: '',
      counts_SideA: {},
      counts_SideB: {},
      pending_Bracket: false,
      pending_Payment: false,
      hasSeatData_SideA: false,
      hasSeatData_SideB: false,
      error: '',
      loading_caption: loading_captions[0]
    });

    // Web3Actions.retrieveBrackets();

    Web3Actions.retrieveBracket(this.props.match.params.id);
  },
  componentDidMount: function()
  {
    BracketStore.addChangeListener(this._onChange);

    BracketStore.addFetchSeatsSideAListener(this._onFetchSeats_SideA);
    BracketStore.addFetchSeatsSideBListener(this._onFetchSeats_SideB);

    BracketStore.addTransactionHashListener(this.onEvent_TransactionHash);
    BracketStore.addConfirmationListener(this.onEvent_Confirmation);
    BracketStore.addReceiptListener(this.onEvent_Receipt);
    BracketStore.addErrorListener(this.onEvent_Error);
  },
  componentWillUnmount: function()
  {
    BracketStore.removeChangeListener(this._onChange);

    BracketStore.removeFetchSeatsSideAListener(this._onFetchSeats_SideA);
    BracketStore.removeFetchSeatsSideBListener(this._onFetchSeats_SideB);

    BracketStore.removeTransactionHashListener(this.onEvent_TransactionHash);
    BracketStore.removeConfirmationListener(this.onEvent_Confirmation);
    BracketStore.removeReceiptListener(this.onEvent_Receipt);
    BracketStore.removeErrorListener(this.onEvent_Error);
  },
  _onChange: function()
  {
    this.setState({
      playerCount: BracketStore.getPlayerCount(),
      winner: BracketStore.getBracketWinner(),
      owner: BracketStore.getBracketOwner()
    });
  },
  onEvent_TransactionHash: function()
  {
    console.log("onEvent_TransactionHash");

    this.setState({
      // pending_Bracket: true,
      loading_caption: loading_captions[2]
    });
  },
  onEvent_Confirmation: function()
  {
    console.log("onEvent_Confirmation");

    this.setState({
      pending_Payment: false,
      pending_Bracket: true,
      loading_caption: loading_captions[0]
    });

    this.forceUpdate();
  },
  onEvent_Receipt: function()
  {
    console.log("onEvent_Receipt");

    switch(this.state.userAction)
    {
      case ACTION_FILL_SEAT_SIDE_A:
        console.log("A");
        break;

      case ACTION_FILL_SEAT_SIDE_B:
        console.log("B");
        break;

      case ACTION_PROMOTE_PLAYER_SIDE_A:
        break;

      case ACTION_PROMOTE_PLAYER_SIDE_B:
        break;

      case ACTION_SET_WINNER:
        break;
    }

    console.log(this.state.userAction);

    this.setState({
      hasSeatData_SideA: false,
      hasSeatData_SideB: false,
      pending_Bracket: false,
      userAction: ACTION_NONE
    });

    var bracketId = this.props.match.params.id;
    setTimeout(function() {
      console.log("C");
      Web3Actions.retrieveBracket(bracketId);
    }, 1);
  },
  onEvent_Error: function()
  {
    console.log("onEvent_Error");

    this.setState({
      pending_Payment: false,
      userAction: ACTION_NONE
    });

    this.forceUpdate();
  },
  _onFetchSeats_SideA: function()
  {
    console.log("_onFetchSeats_SideA");

    var seats = BracketStore.getSeats_SideA();

    var grid_SideA = fill_SideA(this.state.playerCount, seats);

    //
    console.log("-----");
    var transpose = _.zip.apply(null, grid_SideA);

    console.log(transpose);

    function setPromo(index, n)
    {
      console.log("=== setPromo");

      var row = transpose[index];

      for (var i = 0; i < row.length; i += n)
      {
        if (row[i].value != "0x0000000000000000000000000000000000000000")
        {
          row[i].promo = true;

          // clear promo for previous rows
          clearPromo(index, i);
        }
      }
      return row;
    }

    function clearPromo(n, i)
    {
      console.log("=== clearPromo ", i);

      // n = row index
      // i = apex

      n -= 1;
      while (n >= 0)
      {
        // row below apex
        var row = transpose[n];

        // points adjacent to apex



        // transpose[n].promo = false;


        console.log(row, n, 2**n);

        n -= 1;
      }
    }

    for (var n = 0; n < grid_SideA[0].length; n += 1 )
    {
      // console.log(transpose[n], n, 2**n);

      transpose[n] = setPromo(n, 2**n);

      console.log(transpose[n], n, 2**n);

      // recusively clear previous rows
    }

    // console.log("+");
    //
    // for (var n = grid_SideA[0].length - 1; n >= 0; n -= 1 )
    // {
    //   console.log(transpose[n], n, 2**n);
    // }
    console.log("-----");
    //

    var counts = count_SideA(grid_SideA);

    var that = this;

    setTimeout(function() {
      that.setState({
        bracket_SideA: grid_SideA,
        hasSeatData_SideA: true,
        winner_SideA: seats[0],
        counts_SideA: counts
      });
    }, 1000);
  },
  _onFetchSeats_SideB: function()
  {
    console.log("_onFetchSeats_SideB");

    var seats = BracketStore.getSeats_SideB();

    var grid_SideB = fill_SideB(this.state.playerCount, seats);

    //
    console.log("-----");
    var transpose = _.zip.apply(null, grid_SideB);

    console.log(transpose);

    // for (var n = grid_SideB[0].length - 1; n >= 0; n -= 1 )
    // {
    //   console.log(transpose[n], n, 2**n);
    // }
    //
    // console.log("+");

    for (var n = 0; n < grid_SideB[0].length; n += 1 )
    {
      console.log(transpose[n], n, 2**n);
    }

    console.log("-----");
    //

    var counts = count_SideB(grid_SideB);

    var that = this;

    setTimeout(function() {
      that.setState({
        bracket_SideB: grid_SideB,
        hasSeatData_SideB: true,
        winner_SideB: seats[0],
        counts_SideB: counts
      });
    }, 1000);
  },
  render: function()
  {
    const {
      bracket_SideA,
      bracket_SideB,
      winner_SideA,
      winner_SideB,
      counts_SideA,
      counts_SideB,
      winner,
      owner,
      hasSeatData_SideA,
      hasSeatData_SideB,
      playerCount
    } = this.state;

    let {
      pending_Bracket,
      pending_Payment
    } = this.state;

    var error = this.state.error;

    var loaded = false;

    if (hasSeatData_SideA && hasSeatData_SideB)
    {
      loaded = true;
    }

    if (pending_Payment)
    {
      loaded = false;
    }

    const bracketId = this.props.match.params.id;

    var rows_SideA = [];

    for (var i = 0; i < bracket_SideA.length; i += 1)
    {
      rows_SideA.push(
        {
            index: i,
            value: bracket_SideA[i]
        }
      );
    }

    // console.log(rows_SideA);

    var rows_SideB = [];

    for (var i = 0; i < bracket_SideB.length; i += 1)
    {
      rows_SideB.push(
        {
            index: i,
            value: bracket_SideB[i]
        }
      );
    }

    // console.log(rows_SideB);

    var isModerator = false;
    if (window.authorizedAccount == owner)
    {
      isModerator = true;
    }

    var hasWinner = false;

    if (winner != "0x0000000000000000000000000000000000000000")
    {
      hasWinner = true;
    }

    var players =
    [
      winner_SideA,
      winner_SideB
    ];

    const onChange = (event) =>
    {
      // console.log(event.target.value);

      this.setState({
        input: event.target.value,
        error: ''
      });
    };

    const onSubmit = (event) =>
    {
      event.preventDefault();

      const winner = event.target.winner.value;

      this.setState({
        pending_Payment: true,
        error: '',
        loading_caption: loading_captions[1],
        userAction: ACTION_SET_WINNER
      });

      // amount = window.web3.utils.toWei(amount.toString(), 'ether');
      const gas = 650000;
      const gasPrice = window.web3.utils.toWei("20", 'shannon');

      var params = {
        // value: amount,
        from: window.authorizedAccount,
        gas: gas,
        gasPrice: gasPrice
      };

      Web3Actions.setBracketWinner(bracketId, winner, params);
    };

    const handleClickFor_FillSeat = (bracketId, side, seat, e) =>
    {
      e.preventDefault();

      console.log("handleClickFor_FillSeat");

      console.log(bracketId);
      console.log(side);
      console.log(seat);

      const amount = window.web3.utils.toWei("0.01", 'ether');
      const gas = 650000;
      const gasPrice = window.web3.utils.toWei("20", 'shannon');

      var params = {
        value: amount,
        from: window.authorizedAccount,
        gas: gas,
        gasPrice: gasPrice
      };

      if (side == "A")
      {
        this.setState({
          pending_Payment: true,
          loading_caption: loading_captions[1],
          userAction: ACTION_FILL_SEAT_SIDE_A
        });

        Web3Actions.takeSeat_SideA(bracketId, seat, params);
      }

      if (side == "B")
      {
        this.setState({
          pending_Payment: true,
          loading_caption: loading_captions[1],
          userAction: ACTION_FILL_SEAT_SIDE_B
        });

        Web3Actions.takeSeat_SideB(bracketId, seat, params);
      }
    }

    const handleClickFor_PromoteSeat = (bracketId, side, seat, address, e) =>
    {
      e.preventDefault();

      console.log("handleClickFor_PromoteSeat");

      console.log(bracketId);
      console.log(side);
      console.log(seat);
      console.log(address);

      const amount = window.web3.utils.toWei("0.01", 'ether');
      const gas = 650000;
      const gasPrice = window.web3.utils.toWei("20", 'shannon');

      var params = {
        // value: amount,
        from: window.authorizedAccount,
        gas: gas,
        gasPrice: gasPrice
      };

      if (side == "A")
      {
        this.setState({
          pending_Payment: true,
          loading_caption: loading_captions[1],
          userAction: ACTION_PROMOTE_PLAYER_SIDE_A
        });

        Web3Actions.promotePlayer_SideA(bracketId, seat, address, params);
      }

      if (side == "B")
      {
        this.setState({
          pending_Payment: true,
          loading_caption: loading_captions[1],
          userAction: ACTION_PROMOTE_PLAYER_SIDE_B
        });

        Web3Actions.promotePlayer_SideB(bracketId, seat, address, params);
      }
    }

    return (
      <div>
        <p className="highlighted">Bracket</p>

        {
          loaded &&
            <div>
              <table className="bracket">
                <tbody>
                  <tr>
                    <td>
                      <table className="bracket-side-a">
                        <tbody>
                          {rows_SideA.map(item => (
                            <BracketRow
                              key={item.index}
                              item={item.value}
                              bracketId={bracketId}
                              owner={owner}
                              counts={counts_SideA}
                              side="A"
                              handleClickFor_FillSeat={handleClickFor_FillSeat}
                              handleClickFor_PromoteSeat={handleClickFor_PromoteSeat}
                            />
                          ))}
                        </tbody>
                      </table>
                    </td>
                    <td>
                      <table className="bracket-side-b">
                        <tbody>
                          {rows_SideB.map(item => (
                            <BracketRow
                              key={item.index}
                              item={item.value}
                              bracketId={bracketId}
                              owner={owner}
                              counts={counts_SideB}
                              side="B"
                              handleClickFor_FillSeat={handleClickFor_FillSeat}
                              handleClickFor_PromoteSeat={handleClickFor_PromoteSeat}
                            />
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <br />

              <div>
                Bracket Winner: {this.state.winner} <br />
                Bracket Moderator: {this.state.owner}
                <br />
              </div>
              <br />

              {
                isModerator && !hasWinner &&
                  <form onSubmit={onSubmit}>
                    {
                      (winner_SideA != '' && winner_SideB != '') &&
                      <div>
                        <WinnerSelector onSelect={this.handleSelect} players={players} />

                        <div><input type="submit" value="Set Winner" /></div>
                      </div>
                    }
                  <br />
                  </form>
              }
            </div>
        }

        {
          !loaded &&
            <div>
              <Spinner intent={Intent.PRIMARY} />
              <div>{this.state.loading_caption}</div>
              <br />
            </div>
        }
      </div>
    );
  }
});

function BracketRow(props)
{
  const {
    item,
    side,
    bracketId,
    owner,
    counts,
    handleClickFor_FillSeat,
    handleClickFor_PromoteSeat
  } = props;

  var rowLength = item.length;

  return (
    <tr>
      {item.map((item, index) => (
        <BracketSlot
          key={Math.floor(Math.random() * 1000000)}
          item={item}
          columnIndex={index}
          rowLength={rowLength}
          side={side}
          bracketId={bracketId}
          owner={owner}
          counts={counts}
          handleClickFor_FillSeat={handleClickFor_FillSeat}
          handleClickFor_PromoteSeat={handleClickFor_PromoteSeat}
        />
      ))}
    </tr>
  );
}

function BracketSlot(props)
{
  var {
    item,
    columnIndex,
    rowLength,
    side,
    bracketId,
    owner,
    counts,
    handleClickFor_FillSeat,
    handleClickFor_PromoteSeat
  } = props;

  var highlight = false;

  var style = "";

  var text = "X";
  var index = "";

  var isPromoActionProhibited = false;
  var isJoinActionProhibited = false;

  if (typeof item === 'object')
  {
    var head = item.value.substring(0, 5);
    var tail = item.value.substring(item.value.length - 5, item.value.length);
    text = head + '...' + tail;

    if (text == "0x000...00000")
    {
      if (side == "A")
      {
        style = "cell-side-a-player";
      }
      if (side == "B")
      {
        style = "cell-side-b-player";
      }

      isPromoActionProhibited = true;
    }
    else
    {
      if (side == "A")
      {
        style = "cell-side-a-player-highlight";
      }
      if (side == "B")
      {
        style = "cell-side-b-player-highlight";
      }
      isJoinActionProhibited = true;
    }

    text = item.index + " : " + text;
    index = item.index;
  }

  var showJoinButton_SideA = false
  var showJoinButton_SideB = false

  if (side == "A")
  {
    if (columnIndex == 0)
    {
      showJoinButton_SideA = true
    }
  }

  if (side == "B")
  {
    if (columnIndex == rowLength - 1)
    {
      showJoinButton_SideB = true
    }
  }

  var address = item.value;

  var enabled = false;

  if (index != "")
  {
    enabled = true;
  }

  var isModerator = false;
  if (window.authorizedAccount == owner)
  {
    isModerator = true;
  }

  if (address && address != "0x0000000000000000000000000000000000000000")
  {
    // if (counts[address])
    // {
    //   console.log("--------");
    //   console.log(counts[address]);
    //   console.log(address);
    //   console.log(columnIndex);
    // }
  }

  return (

    enabled ? (
      <td className={style}>
        {
          side == "A" &&
            <div>
              {
                showJoinButton_SideA && !isModerator && !isJoinActionProhibited &&
                  <ActionLink_FillSeat bracketId={bracketId} owner={owner} side={side} seat={index} handleClickFor_FillSeat={handleClickFor_FillSeat} />
              }
              &nbsp;{text}&nbsp;
              {
                isModerator && !isPromoActionProhibited &&
                  <ActionLink_PromoteSeat bracketId={bracketId} owner={owner} side={side} seat={index} address={address} handleClickFor_PromoteSeat={handleClickFor_PromoteSeat} />
              }
            </div>
        }

        {
          side == "B" &&
            <div>
              {
                isModerator && !isPromoActionProhibited &&
                  <ActionLink_PromoteSeat bracketId={bracketId} owner={owner} side={side} seat={index} address={address} handleClickFor_PromoteSeat={handleClickFor_PromoteSeat} />
              }
              &nbsp;{text}&nbsp;
              {
                showJoinButton_SideB && !isModerator && !isJoinActionProhibited &&
                  <ActionLink_FillSeat bracketId={bracketId} owner={owner} side={side} seat={index} handleClickFor_FillSeat={handleClickFor_FillSeat} />
              }
            </div>
        }
      </td>
    ) : (
      <td className={style}>{text}</td>
    )
  );
}

function ActionLink_FillSeat(props)
{
  var {
    bracketId,
    owner,
    side,
    seat,
    handleClickFor_FillSeat
  } = props;

  function handleClick(bracketId, side, seat, e)
  {
    handleClickFor_FillSeat(bracketId, side, seat, e)
  }

  return (
      <a href="#" onClick={(e) => handleClick(bracketId, side, seat, e)}>+</a>
  );
}

function ActionLink_PromoteSeat(props)
{
  var {
    bracketId,
    owner,
    side,
    seat,
    address,
    handleClickFor_PromoteSeat
  } = props;

  function handleClick(bracketId, side, seat, address, e)
  {
    handleClickFor_PromoteSeat(bracketId, side, seat, address, e);
  }

  var button = ""

  if (side == "A")
  {
    button = "-->";
  }

  if (side == "B")
  {
    button = "<--";
  }

  return (
      <a href="#" onClick={(e) => handleClick(bracketId, side, seat, address, e)}>{button}</a>
  );
}

module.exports = Bracket;
