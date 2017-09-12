import '../../styles/index.scss';

import Wagers from '../components/Wagers';
import Web3Shim from '../components/Web3Shim';

import ImgLogo from '../../images/logo.png';

import Start from '../components/Start';
import Invite from '../components/Invite';
import Wager from '../components/Wager';

import React from 'react';
import ReactDOM from 'react-dom';

import {
  HashRouter as Router,
  Route,
  Provider,
  Link,
  withRouter
} from 'react-router-dom'

const StartButton = withRouter(({ history, label, to }) => (
  <div>
    <button type="button" className="btn-secondary" onClick={() => history.replace(to)} >
      {label}
    </button>
  </div>
))

const Logo = withRouter(({ history }) => (
  <div onClick={() => history.replace('/')}>
    <img src={ImgLogo} className="logo"  />
  </div>
))

const AppView = () => (
  <Router>
    <div>
      <Logo />
      <br />
      <div>Smart Wagers with Ethereum Blockchain</div>
      <br />

      <MistSite />

    </div>
  </Router>
)

// const MistSite = () => (
//   <div>
//     <StartButton to="/start" label="Start Wager" />
//     <br />
//   </div>
// )

class MistSite extends React.Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    if (typeof(mist) !== "undefined") {
      console.log("Mist browser detected");
      this.setState({
        hasMist: true
      });
    } else {
      console.log("Mist browser not detected");
      this.setState({
        hasMist: false
      });
    }
  }
  componentDidMount() {
  }
  render() {

    const hasMistBrowser = this.state.hasMist;

    return (
      <div>
        { hasMistBrowser ? (
          <div>
            <Route exact path="/" component={Home}/>
            <Route exact path="/start" component={Start}/>

            <Route exact path={`/invites/:id`} component={Invite}/>

            <Route exact path={`/wagers/:id`} component={Wager}/>

            <Web3Shim />
            <Wagers />
            
            <br />
          </div>
        ) : (
          <div>
            <div className="highlighted-red">Pay2Play requires Mist browser to work.</div>
            <div>Please <a href="https://github.com/ethereum/mist/releases">download</a> Mist browser and all the blocks before using Pay2Play</div>
            <div>MetaMask and Parity support comming soon.</div>
            <br />
          </div>
        )}
      </div>
    );
  }
}

const Home = () => (
  <div>
    <StartButton to="/start" label="Start Wager" />
    <br />
  </div>
)

export default AppView
