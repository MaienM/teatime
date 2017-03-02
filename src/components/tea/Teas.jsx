import React from 'react';
import Relay from 'react-relay';
import { PageHeader } from 'react-bootstrap';
import HeaderButtons from 'components/HeaderButtons';
import TeasTable from 'components/tea/TeasTable';

function Teas(props) {
	return (
		<div>
			<PageHeader>
				Tea
				<HeaderButtons create="/tea/new" />
			</PageHeader>
			<TeasTable viewer={props.viewer} />
		</div>
	);
}

export default Relay.createContainer(Teas, {
	fragments: {
		viewer: () => Relay.QL`
			fragment on Query {
				${TeasTable.getFragment('viewer')},
			}
		`,
	},
});
