import React from 'react';
import WagerBulkStore from '../stores/WagerBulkStore';
import Web3Actions from '../actions/Web3Actions';

import {
  Link,
  Route,
  HashRouter as Router,
  browserHistory, Redirect
} from 'react-router-dom'

var Wagers = React.createClass({
  getInitialState: function() {
    return WagerBulkStore.getList();
  },
  componentWillMount: function() {
    this.setState(WagerBulkStore.getList());
    Web3Actions.retrieveWagers();
  },
  componentDidMount: function() {
    WagerBulkStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    WagerBulkStore.removeChangeListener(this._onChange);
  },
  componentWillReceiveProps: function() {
  },
  _onChange: function() {
    this.setState(WagerBulkStore.getList());
  },
  render: function() {
    return (
      <div>
        <p className="highlighted">Wagers</p>
        <table className="wagers">
          <thead>
            <tr>
              <td>
                Id
              </td>
              <td>
                Status
              </td>
              <td>
                Creator
              </td>
              <td>
                Start Timestamp
              </td>
              <td>
                Pot (Eth)
              </td>
            </tr>
          </thead>
          <tbody>
            {this.state.list.map(item => (
              <WagerItem
                key={item.id}
                item={item}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
});

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

function WagerItem(props) {
  const {item} = props;

  var isOpen = true;
  var isClosed = false;

  if (item.state != "open")
  {
      isOpen = false;
  }

  if (item.state == "closed")
  {
      isClosed = true;
  }

  var isCreator = (item.players[0] === window.authorizedAccount && window.authorizedAccount != undefined);
  var isCounter = (item.players[1] === window.authorizedAccount && window.authorizedAccount != undefined);

  // console.log(window.authorizedAccount);

  var style = "";

  if (isCreator)
  {
    style = "highlight-creator";
  }

  if (isCounter)
  {
    style = "highlight-player";
  }

  return (
    <tr className={style}>
      <td>
        {
          isOpen ?
          (
              <Link to={`/invites/${item.index}`} replace>
                {item.index}
              </Link>
          )
          :
          (
              <Link to={`/wagers/${item.index}`} replace>
                {item.index}
              </Link>
          )
        }
      </td>
      <td>
        <div>
          { isClosed ? (
            <div>
              {
                isCreator || isCounter ? (
                  <div>
                    funded
                  </div>
                ) : (
                  <div>
                    { item.state }
                  </div>
                )
              }
            </div>
          ) : (
            <div>
              { item.state }
            </div>
          )}
        </div>
      </td>
      <td>
        {item.players[0]}
      </td>
      <td>
        {item.date}
      </td>
      <td>
        {item.amount / 1000000000000000000}
      </td>
    </tr>
  );
}

module.exports = Wagers;
