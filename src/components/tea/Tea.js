import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';

class Tea extends React.Component {
	render() {
		const tea = this.props.viewer.tea;
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
