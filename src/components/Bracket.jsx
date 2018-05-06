import React from 'react';

import BracketStore from '../stores/BracketStore';
import Web3Actions from '../actions/Web3Actions';

import WinnerSelector from '../components/WinnerSelector';

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
  console.log("fill_SideA");

  console.log(playerCount);
  console.log(data.length);

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

    console.log(row);

    grid.push(row);
  }

  var grid = _.zip.apply(_, grid);

  console.log(grid);

  return grid;
}

function fill_SideB(playerCount, data)
{
  console.log("fill_SideB");

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

    console.log(row);

    grid.push(row);
  }

  grid = grid.reverse();

  var grid = _.zip.apply(_, grid);

  console.log(grid);

  return grid;
}

var loading_captions = [
  "Pending Payment...",
  "Pending Confirmation..."
]

var Bracket = React.createClass({
  getInitialState: function() {
    return {
      playerCount: 32,
      seatsData_SideA: BracketStore.getSeats_SideA(),
      seatsData_SideB: BracketStore.getSeats_SideB()
    };
  },
  componentWillMount: function()
  {
    // var playerCount = 32;
    var grid_SideA = fill_SideA(this.state.playerCount, data_A);
    var grid_SideB = fill_SideB(this.state.playerCount, data_B);

    this.setState({
      bracket_SideA: grid_SideA,
      bracket_SideB: grid_SideB,
      winner_SideA: '',
      winner_SideB: '',
      loaded: false,
      error: '',
      loading_caption: loading_captions[0]
    });

    Web3Actions.retrieveBrackets();

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
  _onChange: function() {
    this.setState({
      playerCount: BracketStore.getPlayerCount(),
      winner: BracketStore.getBracketWinner()
    });
  },
  onEvent_TransactionHash: function()
  {
    console.log("onEvent_TransactionHash");

    // this.setState({
    //     loading_caption: loading_captions[2]
    // });
  },
  onEvent_Confirmation: function()
  {
    console.log("onEvent_Confirmation");

    // this.setState({
    //   loaded: true,
    //   processing: true
    // });
  },
  onEvent_Receipt: function()
  {
    console.log("onEvent_Receipt");
  },
  onEvent_Error: function()
  {
    console.log("onEvent_Error");

    // this.setState({
    //   loaded: true
    // });
    //
    // this.forceUpdate();
  },
  _onFetchSeats_SideA: function() {
    console.log("AAA");

    var seats = BracketStore.getSeats_SideA();

    var grid_SideA = fill_SideA(this.state.playerCount, seats);

    this.setState({
      bracket_SideA: grid_SideA,
      winner_SideA: seats[0]
    });
  },
  _onFetchSeats_SideB: function() {
    console.log("BBB");

    // var playerCount = 32;

    var seats = BracketStore.getSeats_SideB();

    var grid_SideB = fill_SideB(this.state.playerCount, seats);

    this.setState({
      bracket_SideB: grid_SideB,
      winner_SideB: seats[0]
    });
  },

  render: function() {
    const {bracket_SideA, bracket_SideB, winner_SideA, winner_SideB} = this.state;

    var error = this.state.error;
    var loaded = this.state.loaded;

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

    var isModerator = false;
    if (window.authorizedAccount == window.host_BracketRegistrar)
    {
      isModerator = true;
    }

    var players = [
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

      console.log(event.target.winner.value);

      // console.log(this.state.input);

      const winner = event.target.winner.value;

      this.setState({
        loaded: false,
        error: '',
        loading_caption: loading_captions[1]
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

    return (
      <div>
        <p className="highlighted">Bracket</p>
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
                        side="A"
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
                        side="B"
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
          Bracket Winner: {this.state.winner}
          <br />
        </div>
        <br />

        {
          isModerator &&
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
    );
  }
});

function BracketRow(props) {
  const {item, side, bracketId} = props;
  return (
    <tr>
      {item.map(item => (
        <BracketSlot
          key={Math.floor(Math.random() * 1000000)}
          item={item}
          side={side}
          bracketId={bracketId}
        />
      ))}
    </tr>
  );
}

function BracketSlot(props) {
  var {item, side, bracketId} = props;

  var highlight = false;

  var style = "";

  var text = "X";
  var index = "";

  // console.log(item);

  if (typeof item === 'object')
  {
    var head = item.value.substring(0, 3);
    var tail = item.value.substring(item.value.length - 4, item.value.length - 1);
    text = head + '...' + tail;

    if (text == "0x0...000")
    {
      style = "highlight-creator";
    }
    else
    {
      style = "highlight-player";
    }

    text = item.index + " : " + text;
    index = item.index;
  }

  var address = item.value;

  var enabled = false;

  if (index != "")
  {
    enabled = true;
  }

  var isModerator = false;
  if (window.authorizedAccount == window.host_BracketRegistrar)
  {
    isModerator = true;
  }

  return (

    enabled ? (
      <td className={style}>
        {
          side == "A" &&
            <div>
              <ActionLink_FillSeat bracketId={bracketId} side={side} seat={index} />&nbsp;
              {text}&nbsp;
              {
                isModerator &&
                  <ActionLink_PromoteSeat bracketId={bracketId} side={side} seat={index} address={address} />
              }
            </div>
        }

        {
          side == "B" &&
            <div>
              {
                isModerator &&
                  <ActionLink_PromoteSeat bracketId={bracketId} side={side} seat={index} address={address} />
              }
              &nbsp;{text}&nbsp;
              <ActionLink_FillSeat bracketId={bracketId} side={side} seat={index} />
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
  var seat = props.seat;
  var side = props.side;
  var bracketId = props.bracketId;

  function handleClick(bracketId, side, seat, e)
  {
    e.preventDefault();

    console.log(seat);
    console.log(side);

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
      Web3Actions.takeSeat_SideA(bracketId, seat, params);
    }

    if (side == "B")
    {
      Web3Actions.takeSeat_SideB(bracketId, seat, params);
    }
  }

  return (
      <a href="#" onClick={(e) => handleClick(bracketId, side, seat, e)}>+</a>
  );
}

function ActionLink_PromoteSeat(props)
{
  // var seat = props.seat;
  // var side = props.side;
  // var bracketId = props.bracketId;

  var {bracketId, side, seat, address} = props;

  function handleClick(bracketId, side, seat, address, e)
  {
    e.preventDefault();

    console.log(seat);
    console.log(side);

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
      Web3Actions.promotePlayer_SideA(bracketId, seat, address, params);
    }

    if (side == "B")
    {
      Web3Actions.promotePlayer_SideB(bracketId, seat, address, params);
    }
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
