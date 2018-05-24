import React, { Component } from 'react';
import WagerBulkStore from '../stores/WagerBulkStore';
import Web3Actions from '../actions/Web3Actions';

import {
  Link,
  Route,
  HashRouter as Router,
  browserHistory, Redirect
} from 'react-router-dom'

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

export default class Wagers extends Component
{
  state = WagerBulkStore.getList();
  // getInitialState()
  // {
  //   return WagerBulkStore.getList();
  // }
  componentWillMount()
  {
    this.setState(WagerBulkStore.getList());
    Web3Actions.retrieveWagers();
  }
  componentDidMount()
  {
    WagerBulkStore.addChangeListener(this._onChange, this);
  }
  componentWillUnmount()
  {
    WagerBulkStore.removeChangeListener(this._onChange, this);
  }
  componentWillReceiveProps()
  {
  }
  _onChange(e, a)
  {
    console.log("target", e, a)
    // console.log("this.state", this.state)
    this.setState(WagerBulkStore.getList());
  }
  // update()
  // {
  //
  // }

  render()
  {
    return (
      <div>
        <p className="highlighted">Wagers</p>

        <BrowserView device={isBrowser}>
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
        </BrowserView>

        <MobileView device={isMobile}>
          {
            this.state.list.map(item => (
              <WagerItem_Mobile
                key={item.id}
                item={item}
              />
            ))
          }
        </MobileView>

      </div>
    );
  }
};

function WagerItem(props)
{
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

function WagerItem_Mobile(props)
{
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

  let creator = item.players[0];
  var head = creator.substring(0, 5);
  var tail = creator.substring(creator.length - 5, creator.length);
  creator = head + '...' + tail;

  return (
    <div class={style}>
      <div>
        Id:&nbsp;
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
      </div>
      <div>
        { isClosed ? (
          <div>
            {
              isCreator || isCounter ? (
                <div>
                  Status:&nbsp;funded
                </div>
              ) : (
                <div>
                  Status:&nbsp;{ item.state }
                </div>
              )
            }
          </div>
        ) : (
          <div>
            Status:&nbsp;{ item.state }
          </div>
        )}
      </div>
      <div>
        Creator:&nbsp;{creator}
      </div>
      <div>
        Date:&nbsp;{item.date}
      </div>
      <div>
        Amount:&nbsp;{item.amount / 1000000000000000000}
      </div>
      <br/>
    </div>
  );
}


// module.exports = Wagers;
