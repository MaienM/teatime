import React from 'react';
import Relay from 'react-relay';
import { Router, Route, IndexRoute, browserHistory, applyRouterMiddleware } from 'react-router';
import useRelay from 'react-router-relay';

import App from './App';
import Teas from './tea/Teas';
import Tea from './tea/Tea';
import TeaForm from './tea/TeaForm';
import TeaDelete from './tea/TeaDelete';
import TeaPrint from './tea/TeaPrint';

const RootQuery = {
	viewer: () => Relay.QL`
		query {
			query,
		}
	`,
};

const routes = (
	<Route path="/" name="Home" component={App}>
		<IndexRoute breadcrumbIgnore />

		{/* Tea */}
		<Route path="tea" name="Tea">
			<IndexRoute component={Teas} queries={RootQuery} breadcrumbIgnore />
			<Route path="new" name="New" component={TeaForm} queries={RootQuery} />
			<Route path=":uuid" name="Unknown" component={Tea} queries={RootQuery}>
				<IndexRoute breadcrumbIgnore />
				<Route path="edit" name="Edit" components={{ body: TeaForm }} queries={{ body: RootQuery }} />
				<Route path="delete" name="Delete" component={TeaDelete} queries={RootQuery} />
				<Route path="print" name="Print" component={TeaPrint} queries={RootQuery} />
			</Route>
		</Route>

		{/* Brand */}
		<Route path="brand" name="Brand">
			<IndexRoute breadcrumbIgnore />
			<Route path=":uuid" name="Unknown" />
		</Route>

		{/* Categories */}
		<Route path="category" name="Category">
			<IndexRoute breadcrumbIgnore />
			<Route path=":uuid" name="Unknown" />
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
