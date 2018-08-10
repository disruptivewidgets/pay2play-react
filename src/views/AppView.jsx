import '../../styles/index.scss';

import Wagers from '../components/Wagers';
import Web3Shim from '../components/Web3Shim';

import ImgLogo from '../../images/logo.png';
import ImgOops from '../../images/oops.png';

import Start from '../components/Start';
import Session from '../components/Session';

import Bracket from '../components/Bracket';
import BracketIndex from '../components/BracketIndex';

import Secret from '../components/Secret';
import Invite from '../components/Invite';
import Wager from '../components/Wager';

import React from 'react';
import ReactDOM from 'react-dom';

import Web3 from 'web3';
import { wagerRegistrarContractAddress } from '../api/Web3API.js';
import interfaces from "../smart-contract/interfaces.js";

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

// import { Helmet } from "react-helmet";

import {
  HashRouter as Router,
  Route,
  Provider,
  Link,
  withRouter
} from 'react-router-dom'

// window.addEventListener('load', function() {
//   if (typeof web3 !== 'undefined') {
//     var provider = web3.currentProvider;
//     window.web3 = new Web3(web3.currentProvider);
//
//     console.log('Web3 detected');
//   } else {
//     console.log('No web3? You should consider trying MetaMask!');
//   }
// });

function logException(ex, context) {
  Raven.captureException(ex, {
    extra: context
  });
  /*eslint no-console:0*/
  window.console && console.error && console.error(ex);
}

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

const Logo_Mobile = withRouter(({ history }) => (
  <div onClick={() => history.replace('/')}>
    <img src={ImgLogo} className="logo-mobile"  />
  </div>
))

const AppView = () => (
  <div>
    {/* <Meta /> */}
    <Router>
      <div>
        <br />

        <BrowserView device={isBrowser}>
            <Logo />
        </BrowserView>
        <MobileView device={isMobile}>
            <Logo_Mobile />
        </MobileView>

        <br />
        <div>Competitive Entertainment Suite</div>
        <div>Smart Wagers and Tournament Brackets on Ethereum Blockchain</div>
        <br />

        <MistSite />
      </div>
    </Router>
  </div>
)

class MistSite extends React.Component {
  constructor(props) {
    super(props);

    this.handleLoad = this.handleLoad.bind(this);
  }
  componentWillMount()
  {
    // if (window.web3.currentProvider.isMetaMask === true) {
    //   console.log("MetaMask detected");
    // }
    this.setState({
      hasMetamask: false,
      hasMist: false,
      hasTrustWallet: false,
      netId: -1
    });

  }
  componentDidMount()
  {
    window.addEventListener('load', this.handleLoad);
  }
  componentWillUnmount()
  {
    window.removeEventListener('load', this.handleLoad);
  }
  handleLoad(e)
  {
    console.log("handle load");
    console.log(e);

    if (typeof web3 !== 'undefined') {
      console.log("web3", window.web3);

      // // region 1
      // try {
      //   throw "";
      // } catch (ex) {
      //     // console.log(ex);
      //     logException(JSON.stringify(window.web3.currentProvider.isTrust));
      // }
      // //

      // version 2
      var provider = window.web3.currentProvider;
      window.web3 = new Web3(provider);
      //

      // version 1
      // var provider = web3.currentProvider;
      // window.web3 = new Web3(web3.currentProvider);
      //

      console.log('Web3 detected');
      if (window.web3.currentProvider.isMetaMask === true) {
        console.log("MetaMask detected");

        window.web3.eth.net.getId().then(netId => {
          this.setState({
            netId: netId
          });
        })

        this.setupWeb3();

        this.setState({
          hasMetamask: true
        });
      }

      if (window.web3.currentProvider.isTrust === true) {
        console.log("TrustWallet detected");

        window.web3.eth.net.getId().then(netId => {
          this.setState({
            netId: netId
          });
        })

        this.setupWeb3();

        this.setState({
          hasTrustWallet: true
        });
      }


      if (typeof(mist) !== "undefined") {
        console.log("Mist browser detected");

        this.setupWeb3();

        this.setState({
          hasMist: true
        });
      }

    } else {
      console.log('No web3? You should consider trying MetaMask!');
    }

    // if (typeof(mist) !== "undefined") {
    //   console.log("Mist browser detected");
    //
    //   this.setState({
    //     hasMist: true
    //   });
    //
    //   //
    //   console.log("WEB3 START");
    //
    //   if (typeof web3 !== 'undefined') {
    //     // Use Mist/MetaMask's provider
    //     window.web3 = new Web3(web3.currentProvider);
    //   } else {
    //     console.log('No web3? You should consider trying MetaMask!');
    //     // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    //     // window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    //   }
    // } else {
    //   console.log("Mist browser not detected");
    //   this.setState({
    //     hasMist: false
    //   });
    // }

  }
  setupWeb3()
  {
    // console.log("Ropsen Pay2Play: ");
    // console.log(contractAddress);

    // if (window.web3.eth.currentProvider.isConnected())
    // {
    //   console.log("web3 connected");
    // }
    // else
    // {
    //   console.log("web3 not connected");
    // }

    this.setState({version: window.web3.version});

    window.web3.eth.getAccounts((err, accounts) => {
      if (err || !accounts || accounts.length == 0) return;
      this.setState({authorizedAccount: accounts[0]});

      window.authorizedAccount = accounts[0];

      // window.web3.currentProvider.publicConfigStore.on('update', (e) => {
      //   console.log(e);
      //
      //   if (window.authorizedAccount === null) {
      //     return;
      //   }
      //
      //   if (window.authorizedAccount === e.selectedAddress) {
      //     return;
      //   }
      //
      //   location.reload();
      // });
    });

    window.web3.eth.getBlockNumber((err, blockNumber) => {
      this.setState({blockNumber: blockNumber});
    });

    window.contract = new window.web3.eth.Contract(interfaces.registrarInterface);
    contract.options.address = wagerRegistrarContractAddress; // Ropsen Pay2Play

    window.contract.methods.registrarStartDate().call({}, function(error, result) {
      // console.log("registrarStartDate");
      // console.log(error, result);
    });

    window.contract.methods.node().call({}, function(error, result) {
      // console.log("node");
      // console.log(error, result);

      window.host_WagerRegistrar = result;
    });
  }
  render()
  {
    const {
      hasMistBrowser,
      hasMetamask,
      hasTrustWallet,
      netId
    } = this.state;

    var isSelectedNetworkSupported = false;

    if (netId == 3)
    {
      isSelectedNetworkSupported = true;
    }

    console.log("React.version", React.version);

    return (
      <div>
        { hasMistBrowser || hasMetamask || hasTrustWallet ? (
          <div>

          { isSelectedNetworkSupported ? (
              <div>
                <Route exact path="/" component={Home} />
                <Route exact path="/start" component={Start} />
                <Route exact path="/session" component={Session} />
                <Route exact path="/secret" component={Secret} />

                <Route exact path={`/invites/:id`} component={Invite}/>

                <Route exact path={`/wagers/:id`} component={Wager}/>

                <Route exact path={`/brackets`} component={BracketIndex}/>
                <Route exact path={`/brackets/:id`} component={Bracket}/>

                <Web3Shim />
                <Wagers />

                <br />
              </div>
            ) : (
              <div>
                <div className="highlighted-ultraviolet">Pay2Play is currently available on Ropsten only. Please enable Ropsten network setting in your Mist/MetaMask installation.</div>
                <br />
                <div>For more information on how to get it setup, see <a href="http://pay2play.io/pdf/MetaMask%20Tutorial.pdf">our tutorial.</a></div>
                <br />
                <div>Cheers, Pay2Play Team!</div>
                <br />
              </div>
            )
          }
          </div>
        ) : (
          <div>
            <div className="highlighted-ultraviolet">Pay2Play currently only works with browsers that support Metamask extension: Opera, Chrome, Brave.</div>
            <div>If you are already using either on of them but don't have MetaMask installed. <br /> Please visit <a href="https://metamask.io">MetaMask</a> to learn more and install it before using Pay2Play.</div>
            <br />

            <div className="highlighted-ultraviolet">
              <img src={ImgOops} className="logo"  />
            </div>
            <br />
            <div>You can also see <a href="http://pay2play.io/pdf/MetaMask%20Tutorial.pdf">our tutorial</a> for more information on how to get it started.</div>
            <br />
            <div>Cheers, Pay2Play Team!</div>
            <br />
          </div>
        )}
      </div>
    );
  }
}

// <link rel="apple-touch-icon" sizes="57x57" href="/icons/apple-icon-57x57.png" />
// <link rel="apple-touch-icon" sizes="60x60" href="/icons/apple-icon-60x60.png" />
// <link rel="apple-touch-icon" sizes="72x72" href="/icons/apple-icon-72x72.png" />
// <link rel="apple-touch-icon" sizes="76x76" href="/icons/apple-icon-76x76.png" />
// <link rel="apple-touch-icon" sizes="114x114" href="/icons/apple-icon-114x114.png" />
// <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-icon-120x120.png" />
// <link rel="apple-touch-icon" sizes="144x144" href="/icons/apple-icon-144x144.png" />
// <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-icon-152x152.png" />
// <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-icon-180x180.png" />
// <link rel="icon" type="image/png" sizes="192x192"  href="/icons/android-icon-192x192.png" />
// <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
// <link rel="icon" type="image/png" sizes="96x96" href="/icons/favicon-96x96.png" />
// <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
// <link rel="manifest" href="/icons/manifest.json" />
// <meta name="msapplication-TileColor" content="#ffffff" />
// <meta name="msapplication-TileImage" content="/icons/ms-icon-144x144.png" />
// <meta name="theme-color" content="#ffffff" />

// import AppleIcon57x57 from "../../images/icons/apple-icon-57x57.png";
// import AppleIcon60x60 from "../../images/icons/apple-icon-60x60.png";
// import AppleIcon72x72 from "../../images/icons/apple-icon-72x72.png";
// import AppleIcon76x76 from "../../images/icons/apple-icon-76x76.png";
// import AppleIcon114x114 from "../../images/icons/apple-icon-114x114.png";
// import AppleIcon120x120 from "../../images/icons/apple-icon-120x120.png";
// import AppleIcon144x144 from "../../images/icons/apple-icon-144x144.png";
// import AppleIcon152x152 from "../../images/icons/apple-icon-152x152.png";
// import AppleIcon180x180 from "../../images/icons/apple-icon-180x180.png";
// import AndroidIcon192x192 from "../../images/icons/android-icon-192x192.png";
// import FavIcon32x32 from "../../images/icons/favicon-32x32.png";
// import FavIcon96x96 from "../../images/icons/favicon-96x96.png";
// import FavIcon16x16 from "../../images/icons/favicon-16x16.png";
// import MsIcon144x144 from "../../images/icons/ms-icon-144x144.png";
//
// import Manifest from "../../images/icons/manifest.json";

// <Helmet>
//
//   <script type="application/ld+json">{`
//     {
//      "name": "App",
//      "icons": [
//       {
//        "src": "\/android-icon-36x36.png",
//        "sizes": "36x36",
//        "type": "image\/png",
//        "density": "0.75"
//       },
//       {
//        "src": "\/android-icon-48x48.png",
//        "sizes": "48x48",
//        "type": "image\/png",
//        "density": "1.0"
//       },
//       {
//        "src": "\/android-icon-72x72.png",
//        "sizes": "72x72",
//        "type": "image\/png",
//        "density": "1.5"
//       },
//       {
//        "src": "\/android-icon-96x96.png",
//        "sizes": "96x96",
//        "type": "image\/png",
//        "density": "2.0"
//       },
//       {
//        "src": "\/android-icon-144x144.png",
//        "sizes": "144x144",
//        "type": "image\/png",
//        "density": "3.0"
//       },
//       {
//        "src": "\/android-icon-192x192.png",
//        "sizes": "192x192",
//        "type": "image\/png",
//        "density": "4.0"
//       }
//      ]
//     }
//   `}
//   </script>
//   <link rel="apple-touch-icon" href={AppleIcon57x57} />
//   <link rel="apple-touch-icon" sizes="57x57" href={AppleIcon57x57} />
//   <link rel="apple-touch-icon" sizes="60x60" href={AppleIcon60x60} />
//   <link rel="apple-touch-icon" sizes="72x72" href={AppleIcon72x72} />
//   <link rel="apple-touch-icon" sizes="76x76" href={AppleIcon76x76} />
//   <link rel="apple-touch-icon" sizes="114x114" href={AppleIcon114x114} />
//   <link rel="apple-touch-icon" sizes="120x120" href={AppleIcon120x120} />
//   <link rel="apple-touch-icon" sizes="144x144" href={AppleIcon144x144} />
//   <link rel="apple-touch-icon" sizes="152x152" href={AppleIcon152x152} />
//   <link rel="apple-touch-icon" sizes="180x180" href={AppleIcon180x180} />
//   <link rel="icon" type="image/png" sizes="192x192" href={AndroidIcon192x192} />
//   <link rel="icon" type="image/png" sizes="32x32" href={FavIcon32x32} />
//   <link rel="icon" type="image/png" sizes="96x96" href={FavIcon96x96} />
//   <link rel="icon" type="image/png" sizes="16x16" href={FavIcon16x16} />
//
//   <meta name="msapplication-TileColor" content="#ffffff" />
//   <meta name="msapplication-TileImage" content={MsIcon144x144} />
//   <meta name="theme-color" content="#ffffff" />
// </Helmet>
// const Meta = React.createClass({
//   render: function() {
//     return (
//       <Helmet
//         link={[
//           {"rel": "apple-touch-icon", "href" : require('../../icons/apple-icon-57x57.png'), "sizes" : "57x57"}
//         ]}
//       />
//     );
//   }
// });

const Home = () => (
  <div>
    <StartButton to="/brackets" label="Brackets" />
    <br />
    <StartButton to="/start" label="Wagers" />
    <br />
  </div>
)

export default AppView
