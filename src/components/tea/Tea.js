import React from 'react';
import Relay from 'react-relay';
import { withRouter, Link } from 'react-router';
import { PageHeader } from 'react-bootstrap';
import HeaderButtons from '../HeaderButtons';

class Tea extends React.Component {
	render() {
		const tea = this.props.viewer.tea;
		// Set the route name, for the breadcrumb
		this.props.route.name = tea.name;
		return (
			<div>
				<PageHeader>
					{tea.name}&nbsp;
					<small>
						<Link to={`/brand/${tea.brand.uuid}`}>
							{tea.brand.name}
						</Link>
					</small>
					<HeaderButtons update={`/tea/${tea.uuid}/edit`} />
				</PageHeader>
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
					uuid,
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
