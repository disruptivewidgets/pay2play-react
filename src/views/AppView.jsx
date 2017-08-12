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

      <Route exact path="/" component={Home}/>
      <Route exact path="/start" component={Start}/>

      <Route exact path={`/invites/:id`} component={Invite}/>

      <Route exact path={`/wagers/:id`} component={Wager}/>

      <Web3Shim />
      <Wagers />

    </div>
  </Router>
)


const Home = () => (
  <div>
    <StartButton to="/start" label="Start Wager" />
  </div>
)

export default AppView
