import React from 'react';
import { withRouter } from 'react-router';
import Breadcrumbs from 'react-breadcrumbs';

export default withRouter((props) => (
	<Breadcrumbs
		routes={props.routes}
		params={props.params}
	/>
));
