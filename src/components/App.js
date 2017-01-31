import React from 'react';
import Relay from 'react-relay';
import { Grid, Row, Col, Navbar, Nav, NavItem } from 'react-bootstrap';
import { Router, Route, IndexRoute, hashHistory, applyRouterMiddleware } from 'react-router';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import useRelay from 'react-router-relay';

import Teas from './tea/Teas';
import Tea from './tea/Tea';

const Queries = {
	viewer: () => Relay.QL`
		query {
			query
		}
	`,
};

class App extends React.Component {
	render() {
		return (
			<div>
				<Navbar>
					<Navbar.Header>
						<Navbar.Brand>
							<a href="#">Tea Time</a>
						</Navbar.Brand>
					</Navbar.Header>
					<Nav>
						<IndexLinkContainer to={{ pathname: '/tea' }}>
							<NavItem href="#">Teas</NavItem>
						</IndexLinkContainer>
						<IndexLinkContainer to={{ pathname: '/brand' }}>
							<NavItem href="#">Brand</NavItem>
						</IndexLinkContainer>
						<IndexLinkContainer to={{ pathname: '/category' }}>
							<NavItem href="#">Category</NavItem>
						</IndexLinkContainer>
					</Nav>
				</Navbar>
				<Grid>
					<Row>
						<Col xs={12} md={12}>
							{this.props.children}
						</Col>
					</Row>
				</Grid>
			</div>
		);
	}
};

function Blank() {
	return null;
}
Blank = Relay.createContainer(Blank, {
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

const routes = (
	<Route path="/" component={App}>
		<IndexRoute />
		<Route path="/tea" component={Teas} queries={Queries} />
		<Route path="/tea/:uuid" component={Tea} queries={Queries} />
		<Route path="/brand" component={Blank} queries={Queries} />
		<Route path="/brand/:uuid" component={Blank} queries={Queries} />
		<Route path="/category" component={Blank} queries={Queries} />
		<Route path="/category/:uuid" component={Blank} queries={Queries} />
	</Route>
);

export default function() {
	return <Router
		history={hashHistory}
	    render={applyRouterMiddleware(useRelay)}
		environment={Relay.Store}
		routes={routes}
	>
	</Router>
};
