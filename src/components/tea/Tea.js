import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';

class Tea extends React.Component {
	render() {
		return (
			<div>
				<h1>{this.props.viewer.tea.name}</h1>
				<h3>
					<Link to={`/brand/${this.props.viewer.tea.brand.uuid}`}>
						{this.props.viewer.tea.brand.name}
					</Link>
				</h3>
			</div>
		);
	}
}

export default Relay.createContainer(Tea, {
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
