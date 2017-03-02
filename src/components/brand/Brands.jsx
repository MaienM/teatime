import React from 'react';
import Relay from 'react-relay';
import PageHeader from 'components/PageHeader';
import HeaderButtons from 'components/HeaderButtons';
import BrandsTable from 'components/brand/BrandsTable';

function Brands(props) {
	return (
		<div>
			<PageHeader>
				Brand
				<HeaderButtons create="/brand/new" />
			</PageHeader>
			<BrandsTable viewer={props.viewer} />
		</div>
	);
}

export default Relay.createContainer(Brands, {
	fragments: {
		viewer: () => Relay.QL`
			fragment on Query {
				${BrandsTable.getFragment('viewer')},
			}
		`,
	},
});
