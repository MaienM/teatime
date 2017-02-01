import _ from 'lodash';
import React from 'react';
import { browserHistory, withRouter } from 'react-router';
import { Breadcrumb } from 'react-bootstrap';
import Breadcrumbs from 'react-router-breadcrumbs';

// Allow us to use an element as wrappingComponent, without warnings
delete Breadcrumbs.propTypes.wrappingComponent;

// Use Breadcrumb.Item as link
const createLink = (link, key, text, index, routes) => (
	<Breadcrumb.Item
		key={key}
		onClick={() => browserHistory.push(link)}
		active={link == browserHistory.getCurrentLocation().pathname}
	>
		{text}
	</Breadcrumb.Item>
)

export default withRouter((props) => (
	<Breadcrumbs
		routes={props.routes}
		params={props.params}
		wrappingComponent={Breadcrumb}
		createLink={createLink}
		createSeparator={null}
	/>
));
