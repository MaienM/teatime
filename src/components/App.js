import React from 'react';
import Relay from 'react-relay';
import { Grid, Row, Col, Navbar, Nav, NavItem } from 'react-bootstrap';
import Query from '../queries/Query';
import Teas from './Teas';

const CONTAINERS = {
	teas: Teas,
}

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			page: 'teas',
		}
	}

	onSelect(eventKey) {
		this.setState({
			page: eventKey,
		});
	}

	render() {
		return (
			<div>
				<Navbar onSelect={this.onSelect.bind(this)}>
					<Navbar.Header>
						<Navbar.Brand>
							<a href="#">Tea Time</a>
						</Navbar.Brand>
					</Navbar.Header>
					<Nav>
						<NavItem eventKey={'teas'} href="#">Teas</NavItem>
					</Nav>
				</Navbar>
				<Grid>
					<Row>
						<Col xs={12} md={12}>
							<Relay.Renderer
								environment={Relay.Store}
								Container={CONTAINERS[this.state.page]}
								queryConfig={new Query()}
							/>
						</Col>
					</Row>
				</Grid>
			</div>
		);
	}
};

export default App;
