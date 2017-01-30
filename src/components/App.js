import React from 'react';
import Relay from 'react-relay';
import { Grid, Row, Col, Navbar, Nav, NavItem } from 'react-bootstrap';
import { Router, Route, IndexRoute, hashHistory, applyRouterMiddleware } from 'react-router';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import useRelay from 'react-router-relay';

import Teas from './Teas';

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
						<IndexLinkContainer to={{ pathname: '/' }}>
							<NavItem href="#">Teas</NavItem>
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

export default function() {
	return <Router
		history={hashHistory}
	    render={applyRouterMiddleware(useRelay)}
		environment={Relay.Store}
	>
		<Route path="/" component={App}>
			<IndexRoute component={Teas} queries={Queries} />
		</Route>
	</Router>
};
