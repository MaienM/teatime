import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';

export default () => (
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
);
