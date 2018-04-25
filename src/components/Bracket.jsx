import React from 'react';

import BracketStore from '../stores/BracketStore';
import Web3Actions from '../actions/Web3Actions';

import _ from 'lodash';

function fill_SideA(playerCount, data)
{
  console.log("fill_SideA");

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
  console.log("cacheSideB");

  var playerCount = 32;

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

var Bracket = React.createClass({
  getInitialState: function() {
    return {
      seatsData_SideA: BracketStore.getSeats_SideA(),
      seatsData_SideB: BracketStore.getSeats_SideB()
    };
  },
  componentWillMount: function() {
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

    var playerCount = 32;

    var grid_SideA = fill_SideA(playerCount, data_A);
    var grid_SideB = fill_SideB(playerCount, data_B);

    this.setState({
      bracket_SideA: grid_SideA,
      bracket_SideB: grid_SideB
    });

    Web3Actions.getSeats_SideA();
    Web3Actions.getSeats_SideB();
  },
  componentDidMount: function() {
    BracketStore.addChangeListener(this._onChange);
    BracketStore.addFetchSeatsSideAListener(this._onFetchSeats_SideA);
    BracketStore.addFetchSeatsSideBListener(this._onFetchSeats_SideB);
  },
  componentWillUnmount: function() {
    BracketStore.removeChangeListener(this._onChange);
    BracketStore.removeFetchSeatsSideAListener(this._onFetchSeats_SideA);
    BracketStore.removeFetchSeatsSideBListener(this._onFetchSeats_SideB);
  },
  _onChange: function() {
    // console.log(BracketStore.getSeats_SideA());
    // console.log("AAAAAAAAAAAAAA");

    // var playerCount = 32;
    //
    // var grid_SideA = fill_SideA(playerCount, BracketStore.getSeats_SideA());
    // var grid_SideB = fill_SideB(playerCount, BracketStore.getSeats_SideB());
    //
    // this.setState({
    //   bracket_SideA: grid_SideA,
    //   bracket_SideB: grid_SideB
    // });
  },
  _onFetchSeats_SideA: function() {
    console.log("AAA");

    var playerCount = 32;

    var grid_SideA = fill_SideA(playerCount, BracketStore.getSeats_SideA());

    this.setState({
      bracket_SideA: grid_SideA
    });
  },
  _onFetchSeats_SideB: function() {
    console.log("BBB");

    var playerCount = 32;

    var grid_SideB = fill_SideB(playerCount, BracketStore.getSeats_SideB());

    this.setState({
      bracket_SideB: grid_SideB
    });
  },
  render: function() {
    const {bracket_SideA, bracket_SideB} = this.state;

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
                      />
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    );
  }
});

function BracketRow(props) {
  const {item} = props;
  return (
    <tr>
      {item.map(item => (
        <BracketSlot
          key={Math.floor(Math.random() * 1000000)}
          item={item}
        />
      ))}
    </tr>
  );
}

function BracketSlot(props) {
  var {item} = props;

  var highlight = false;

  var style = "";

  var text = "X";

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
  }

  // var str = "0";

  return (
    <td className={style}>{text}</td>
  );
}

module.exports = Bracket;
