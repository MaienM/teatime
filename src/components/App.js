import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

import Breadcrumb from './Breadcrumb';
import Navbar from './Navbar';

export default (props) => (
	<div>
		<Navbar />
		<Grid>
			<Row>
				<Col xs={12} md={12}>
					<Breadcrumb />
				</Col>
			</Row>
			<Row>
				<Col xs={12} md={12}>
					{props.children}
				</Col>
			</Row>
		</Grid>
	</div>
);
