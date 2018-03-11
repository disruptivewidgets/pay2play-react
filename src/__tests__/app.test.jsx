import React from 'react';
import { mount, shallow } from 'enzyme';

import AppContainer from '../containers/AppContainer';

const Web3 = require("web3");

describe('App mount', () => {
		it('renders without crashing', () => {
				mount(<AppContainer />);
		});
});

test("Web3 version", function()
{
		expect(Web3.version).toEqual("1.0.0-beta.30");
});
