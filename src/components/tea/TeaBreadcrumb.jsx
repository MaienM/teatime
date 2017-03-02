import React from 'react';
import Relay from 'react-relay';
import { withRouter } from 'react-router';
import { element } from 'helpers/react/propTypes';

class TeaBreadcrumb extends React.Component {
	constructor(props) {
		super(props);

		this.componentDidMount = this.updateBreadcrumb;
		this.componentDidUpdate = this.updateBreadcrumb;
	}

	updateBreadcrumb() {
		// Set the route name
		const { route, router, viewer } = this.props;
		route.name = viewer.tea.name;
		router.updateBreadcrumb();
	}

	render() {
		return this.props.children;
	}
}

TeaBreadcrumb.propTypes = {
	children: element.isRequired,
};

export default Relay.createContainer(withRouter(TeaBreadcrumb), {
	initialVariables: {
		uuid: null,
	},
	fragments: {
		viewer: () => Relay.QL`
			fragment on Query {
				tea: teaByUuid(uuid: $uuid) {
					name,
				},
			}
		`,
	},
});
