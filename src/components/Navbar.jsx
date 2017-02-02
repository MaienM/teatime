import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { IndexLinkContainer } from 'react-router-bootstrap';

export default () => (
	<Navbar>
		<Navbar.Header>
			<Navbar.Brand>
				Tea Time
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
);
