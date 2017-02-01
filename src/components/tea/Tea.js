import React from 'react';
import Relay from 'react-relay';
import { withRouter, Link } from 'react-router';

class Tea extends React.Component {
	render() {
		const tea = this.props.viewer.tea;
		// Set the route name, for the breadcrumb
		this.props.route.name = tea.name;
		return (
			<div>
				<h1>{tea.name}</h1>
				<h3>
					<Link to={`/brand/${tea.brand.uuid}`}>
						{tea.brand.name}
					</Link>
				</h3>
			</div>
		);
	}
}

export default Relay.createContainer(withRouter(Tea), {
	initialVariables: {
		uuid: null,
	},
	fragments: {
		viewer: () => Relay.QL`
			fragment on Query {
				tea: teaByUuid(uuid: $uuid) {
					name,
					brand: brandByBrandUuid {
						uuid,
						name
					}
				}
			}
		`,
	},
});
