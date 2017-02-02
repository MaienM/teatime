import React from 'react';
import ReactDOM from 'react-dom';
import Router from './components/Router';

import './index.scss';

// Accept hot reloads
if (module.hot) {
	module.hot.accept();
}

// Render the router component
ReactDOM.render(
	<Router />,
	document.getElementById('root'),
);
