import React, { Component } from 'react';
import EventLogStore from '../stores/EventLogStore';
import EventLogActions from '../actions/EventLogActions';


export default class EventLogs extends Component
{
  getInitialState()
  {
    return EventLogStore.getData();
  }
  componentWillMount()
  {
    console.log("componentWillReceiveProps");

    this.setState(EventLogStore.getDataStore());
    this.setState(EventLogStore.getData());

    EventLogActions.pullEventLogs("WagerStarted", this.props.index);
    EventLogActions.pullEventLogs("NewDeposit", this.props.index);
    EventLogActions.pullEventLogs("WagerWinnerUpdated", this.props.index);
    EventLogActions.pullEventLogs("WinningsWithdrawn", this.props.index);
  }
  componentDidMount()
  {
    EventLogStore.addChangeListener(this._onChange);
  }
  componentWillUnmount()
  {
    EventLogStore.removeChangeListener(this._onChange);
  }
  componentDidUpdate() {
  }
  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps A");

    console.log(nextProps);

    if (nextProps.index !== this.props.index) {
      // computeValue(nextProps.index)
      //   .then(value => this.setState({value}));

        EventLogActions.pullEventLogs("WagerStarted", nextProps.index);
        EventLogActions.pullEventLogs("NewDeposit", nextProps.index);
        EventLogActions.pullEventLogs("WagerWinnerUpdated", nextProps.index);
        EventLogActions.pullEventLogs("WinningsWithdrawn", nextProps.index);
    }
    // EventLogActions.pullEventLogs("WagerStarted", nextProps.index);
    // EventLogActions.pullEventLogs("NewDeposit", nextProps.index);
    // EventLogActions.pullEventLogs("WagerWinnerUpdated", nextProps.index);
    // EventLogActions.pullEventLogs("WinningsWithdrawn", nextProps.index);
  }
  _onChange()
  {
    this.setState(EventLogStore.getDataStore());
    this.setState(EventLogStore.getData());
  }
  render()
  {
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
};

function EventLogItem(props)
{
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

// module.exports = EventLogs;
