import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import { PageHeader } from 'react-bootstrap';
import HeaderButtons, { HeaderButton } from '../HeaderButtons';

function Tea(props) {
	const tea = props.viewer.tea;

	// Set the route name
	const route = props.route;
	route.name = tea.name;

	return (
		<div>
			{props.body ? props.body : (
				<PageHeader>
					{tea.name}&nbsp;
					<small>
						by <Link to={`/brand/${tea.brand.uuid}`}>
							{tea.brand.name}
						</Link>
					</small>
					{props.children == null &&
						<HeaderButtons
							update={`/tea/${tea.uuid}/edit`}
							delete={`/tea/${tea.uuid}/delete`}
						>
							<HeaderButton action={`/tea/${tea.uuid}/print`} glyph="print">Print</HeaderButton>
						</HeaderButtons>
					}
				</PageHeader>
			)}
			{props.children}
		</div>
	);
}

Tea.propTypes = {
	children: React.PropTypes.element,
};

Tea.defaultProps = {
	children: undefined,
};

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
						name,
					},
				},
			}
		`,
	},
});
