import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import { PageHeader } from 'react-bootstrap';
import HeaderButtons from '../HeaderButtons';

function Tea(props) {
	// Get the tea object
	const tea = props.viewer.tea;

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

export default Relay.createContainer(Tea, {
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
