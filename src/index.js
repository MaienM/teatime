// import 'babel-polyfill';

import Teas from './components/Teas';
import AppHomeQuery from './queries/AppHomeQuery';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';

ReactDOM.render(
	<Relay.Renderer
		environment={Relay.Store}
		Container={Teas}
		queryConfig={new AppHomeQuery()}
	/>,
	document.getElementById('root')
);
