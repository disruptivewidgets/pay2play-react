import React from 'react';
import BracketBulkStore from '../stores/BracketBulkStore';
import Web3Actions from '../actions/Web3Actions';

import {
  Link,
  Route,
  HashRouter as Router,
  browserHistory, Redirect
} from 'react-router-dom'

import * as moment from 'moment';
import 'moment-duration-format';

var BracketIndex = React.createClass({
  getInitialState: function() {
    return BracketBulkStore.getList();
  },
  componentWillMount: function()
  {
    this.setState(BracketBulkStore.getList());
    Web3Actions.retrieveBrackets();
  },
  componentWillReceiveProps: function(nextProps)
  {
    // GameActions.retrieveRules(this.props.referenceHash, this.props.startTimestamp);
  },
  componentDidMount: function()
  {
    BracketBulkStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function()
  {
    BracketBulkStore.removeChangeListener(this._onChange);
  },
  _onChange: function() {
    this.setState(BracketBulkStore.getList());
  },
  render: function() {
    return (
      <div>
        <p className="highlighted">Brackets</p>
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
              <BracketItem
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

function BracketItem(props) {
  const {item} = props;

  return (
    <tr>
      <td>
        <Link to={`/brackets/${item.index}`} replace>
          {item.index}
        </Link>
      </td>
      <td>
      </td>
      <td>
      </td>
      <td>
      </td>
      <td>
      </td>
    </tr>
  );
}

// function BracketItem(props) {
//   const {item} = props;
//
//   var isOpen = true;
//   var isClosed = false;
//
//   if (item.state != "open")
//   {
//       isOpen = false;
//   }
//
//   if (item.state == "closed")
//   {
//       isClosed = true;
//   }
//
//   var isCreator = (item.players[0] === window.authorizedAccount && window.authorizedAccount != undefined);
//   var isCounter = (item.players[1] === window.authorizedAccount && window.authorizedAccount != undefined);
//
//   // console.log(window.authorizedAccount);
//
//   var style = "";
//
//   if (isCreator)
//   {
//     style = "highlight-creator";
//   }
//
//   if (isCounter)
//   {
//     style = "highlight-player";
//   }
//
//   return (
//     <tr className={style}>
//       <td>
//         {
//           isOpen ?
//           (
//               <Link to={`/invites/${item.index}`} replace>
//                 {item.index}
//               </Link>
//           )
//           :
//           (
//               <Link to={`/wagers/${item.index}`} replace>
//                 {item.index}
//               </Link>
//           )
//         }
//       </td>
//       <td>
//         <div>
//           { isClosed ? (
//             <div>
//               {
//                 isCreator || isCounter ? (
//                   <div>
//                     funded
//                   </div>
//                 ) : (
//                   <div>
//                     { item.state }
//                   </div>
//                 )
//               }
//             </div>
//           ) : (
//             <div>
//               { item.state }
//             </div>
//           )}
//         </div>
//       </td>
//       <td>
//         {item.players[0]}
//       </td>
//       <td>
//         {item.date}
//       </td>
//       <td>
//         {item.amount / 1000000000000000000}
//       </td>
//     </tr>
//   );
// }

module.exports = BracketIndex;
