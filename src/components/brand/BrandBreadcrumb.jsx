import React from 'react';
import Relay from 'react-relay';
import { element } from 'helpers/react/propTypes';
import { withRouter } from 'react-router';

class BrandBreadcrumb extends React.Component {
	constructor(props) {
		super(props);

		this.componentDidMount = this.updateBreadcrumb;
		this.componentDidUpdate = this.updateBreadcrumb;
	}

	updateBreadcrumb() {
		// Set the route name
		const { route, router, viewer } = this.props;
		route.name = viewer.brand.name;
		router.updateBreadcrumb();
	}

	render() {
		return this.props.children;
	}
}

BrandBreadcrumb.propTypes = {
	children: element.isRequired,
};

export default Relay.createContainer(withRouter(BrandBreadcrumb), {
	initialVariables: {
		uuid: null,
	},
	fragments: {
		viewer: () => Relay.QL`
			fragment on Query {
				brand: brandByUuid(uuid: $uuid) {
					name,
				},
			}
		`,
	},
});
