import React from 'react';
import Relay from 'react-relay';
import { Router, Route, IndexRoute, browserHistory, applyRouterMiddleware } from 'react-router';
import useRelay from 'react-router-relay';

import App from './App';
import Teas from './tea/Teas';
import Tea from './tea/Tea';

const RootQuery = {
	viewer: () => Relay.QL`
		query {
			query
		}
	`,
};

const routes = (
	<Route
		path="/"
		name="Home"
		component={App}
	>
		<IndexRoute />

		// Tea
		<Route
			path="tea"
			name="Tea"
		>
			<IndexRoute queries={RootQuery}
				component={Teas}
			/>
			<Route queries={RootQuery}
				path=":uuid"
				component={Tea}
			/>
		</Route>

		// Brand
		<Route
			path="brand"
			name="Brand"
		>
			<IndexRoute />
			<Route
				path=":uuid"
			/>
		</Route>

		// Categories
		<Route
			path="category"
			name="Category"
		>
			<IndexRoute />
			<Route
				path=":uuid"
			/>
		</Route>
	</Route>
);

export default () => (
	<Router
		history={browserHistory}
		render={applyRouterMiddleware(useRelay)}
		environment={Relay.Store}
		routes={routes}
	/>
);
