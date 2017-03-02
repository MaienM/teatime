import _ from 'lodash';
import React from 'react';
import Relay from 'react-relay';
import PageHeader from 'components/PageHeader';
import HeaderButtons from 'components/HeaderButtons';
import TeasTable from 'components/tea/TeasTable';

function Brand(props) {
	const brand = props.viewer.brand;
	return (
		<div>
			<PageHeader>
				{brand.name}
				<HeaderButtons
					update={`/brand/${brand.uuid}/edit`}
					delete={`/brand/${brand.uuid}/delete`}
				/>
			</PageHeader>

			<h3>Teas</h3>
			<TeasTable viewer={props.viewer} condition={props.relay.variables.teasCondition} />
		</div>
	);
}

export default Relay.createContainer(Brand, {
	initialVariables: {
		uuid: null,
		teasCondition: {},
	},
	prepareVariables: (prevVariables) => {
		_.set(prevVariables, 'teasCondition.brandUuid', prevVariables.uuid);
		return prevVariables;
	},
	fragments: {
		viewer: (variables) => Relay.QL`
			fragment on Query {
				brand: brandByUuid(uuid: $uuid) {
					uuid,
					name,
				},
				${TeasTable.getFragment('viewer', { condition: variables.teasCondition })},
			}
		`,
	},
});

