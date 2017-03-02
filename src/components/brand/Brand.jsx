import _ from 'lodash';
import React from 'react';
import Relay from 'react-relay';
import { PageHeader, Col, Clearfix } from 'react-bootstrap';
import HeaderButtons from 'components/HeaderButtons';
import TeasTable from 'components/tea/TeasTable';

function Brand(props) {
	const brand = props.viewer.brand;
	return (
		<div>
			<PageHeader>
				<Col sm={12} md={8}>{brand.name}</Col>
				<Col sm={12} md={4}>
					<HeaderButtons
						update={`/brand/${brand.uuid}/edit`}
						delete={`/brand/${brand.uuid}/delete`}
					/>
				</Col>
				<Clearfix />
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

