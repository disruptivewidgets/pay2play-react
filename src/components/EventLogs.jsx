import React from 'react';
import EventLogStore from '../stores/EventLogStore';
import EventLogActions from '../actions/EventLogActions';

var EventLogs = React.createClass({
  getInitialState: function() {
    return EventLogStore.getData();
  },
  componentWillMount: function() {
    this.setState(EventLogStore.getDataStore());
    this.setState(EventLogStore.getData());

    EventLogActions.pullEventLogs("WagerStarted", this.props.index);
    EventLogActions.pullEventLogs("NewDeposit", this.props.index);
    EventLogActions.pullEventLogs("WagerWinnerUpdated", this.props.index);
    EventLogActions.pullEventLogs("WinningsWithdrawn", this.props.index);
  },
  componentDidMount: function() {
    EventLogStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function() {
    EventLogStore.removeChangeListener(this._onChange);
  },
  _onChange: function() {
    this.setState(EventLogStore.getDataStore());
    this.setState(EventLogStore.getData());
  },
  render: function() {

    const hasWagerStarted = (this.state.WagerStarted !== undefined);
    const hasNewDeposit = (this.state.NewDeposit !== undefined);
    const hasWagerWinnerUpdated = (this.state.WagerWinnerUpdated !== undefined);
    const hasWinningsWithdrawn = (this.state.WinningsWithdrawn !== undefined);

    return (
      <div>
        <div className="highlighted">Event Logs</div>
        <br />

        { hasWinningsWithdrawn &&
          this.state.WinningsWithdrawn.map(item => (
            <EventLogItem
              key={item.id}
              item={item}
            />
          ))
        }

        { hasWagerWinnerUpdated &&
          this.state.WagerWinnerUpdated.map(item => (
            <EventLogItem
              key={item.id}
              item={item}
            />
          ))
        }

        { hasNewDeposit &&
          this.state.NewDeposit.map(item => (
            <EventLogItem
              key={item.id}
              item={item}
            />
          ))
        }

        { hasWagerStarted &&
          this.state.WagerStarted.map(item => (
            <EventLogItem
              key={item.id}
              item={item}
            />
          ))
        }

        <br />
      </div>
    );
  }
});

function EventLogItem(props) {
  const {item} = props;

  const url = "https://" + 'ropsten' + ".etherscan.io/tx/" + item.txid;

  return (
    <div>
      <label>
        {item.topic} | <a href={url}>{item.txid}</a>
      </label>
    </div>
  );
}

module.exports = EventLogs;
