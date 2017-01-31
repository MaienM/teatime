import React from 'react';
import Relay from 'react-relay';
import { Router, Route, IndexRoute, hashHistory, applyRouterMiddleware } from 'react-router';
import useRelay from 'react-router-relay';

import App from './App';
import Teas from './tea/Teas';
import Tea from './tea/Tea';

const Blank = Relay.createContainer(() => null, {
	fragments: {
		viewer: () => Relay.QL`
			fragment on Query {
				allTeas(first: 10) {
					edges {
						node {
							id,
						}
					}
				}
			}
		`
	},
});

const RootQuery = {
	viewer: () => Relay.QL`
		query {
			query
		}
	`,
};

const routes = (
	<Route path="/" component={App}>
		<IndexRoute />

		// Tea
		<Route name="Tea" queries={RootQuery}
			path="/tea"
			component={Teas}
		/>
		<Route name="Tea" queries={RootQuery}
			path="/tea/:uuid"
			component={Tea}
		/>

		// Brand
		<Route name="Brand" queries={RootQuery}
			path="/brand"
			component={Blank}
		/>
		<Route name="Brand" queries={RootQuery}
			path="/brand/:uuid"
			component={Blank}
		/>

		// Categories
		<Route name="Route" queries={RootQuery}
			path="/category"
			component={Blank}
		/>
		<Route name="Route" queries={RootQuery}
			path="/category/:uuid"
			component={Blank}
		/>
	</Route>
);

export default () => (
	<Router
		history={hashHistory}
		render={applyRouterMiddleware(useRelay)}
		environment={Relay.Store}
		routes={routes}
	/>
);
