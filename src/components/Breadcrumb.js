import React from 'react';
import { Breadcrumb } from 'react-bootstrap';

export default () => (
	<Breadcrumb>
		<Breadcrumb.Item href="#">
			Home
		</Breadcrumb.Item>
		<Breadcrumb.Item href="#">
			Tea
		</Breadcrumb.Item>
		<Breadcrumb.Item active>
			Earl Grey
		</Breadcrumb.Item>
	</Breadcrumb>
);
