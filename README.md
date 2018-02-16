# pay2play-react
Pay2Play is a decentralized wager settlement system based on Swarm and Ethereum

[Ethereum](http://ethereum.org)
[Web3JS](http://web3js.readthedocs.io/en/1.0/)
[React](https://facebook.github.io/react/)
[WebPack](http://webpack.github.io/)
[Babel](https://babeljs.io/)
[Swarm](http://swarm-gateways.net)
[SwarmDock](http://swarmdock.com)

### To run

* You'll need to have [git](https://git-scm.com/) and [node](https://nodejs.org/en/) installed in your system.
* Fork and clone the project:

```
git clone https://github.com/pay2play/pay2play-react.git
```

* Then install the dependencies:

```
npm install
```

* Build webpack

```
npm run build
```

* Run development server:

```
npm start
```

* Or you can run development server with [webpack-dashboard](https://github.com/FormidableLabs/webpack-dashboard):

```
npm run dev
```

Open the web browser to `http://localhost:8888/`

### To test
To run unit tests:

```
npm test
```

Tests come bundled with:

* Jest
* Enzyme
* React Test Utils
* React Test Renderer

### To build the production package

```
npm run build
```

### Eslint
There is a `.eslint.yaml` config for eslint ready with React plugin.

To run linting, run:

```
npm run lint
```

### S3 Hosting Example

```
sudo pip install aws-cli
rm -r public && mkdir public
npm run build
aws s3 sync public s3://pay2play/public --acl public-read
http://s3-us-west-2.amazonaws.com/pay2play/public/index.html
```


### Notes on importing css styles
* styles having /src/ in their absolute path considered part of the application and exported as local css modules.
* other styles considered global styles used by components and included in the css bundle directly.

### Contribute
Please contribute to the project if you know how to make it better, including this README :)

### Thanks
[react-webpack-babel](https://github.com/alicoding/react-webpack-babel.git)
