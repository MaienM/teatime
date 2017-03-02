import React from 'react';
import Relay from 'react-relay';
import Table from 'components/Table';
import TableControl from 'components/TableControl';

function BrandsTable(props) {
	return (
		<div>
			<Table
				rows={props.viewer.brands}
				columns={{
					Name: 'name',
					Website: 'url',
				}}
				rowLink={(brand) => `/brand/${brand.uuid}`}
			/>
			<TableControl
				totalCount={props.viewer.brands.totalCount}
				variables={props.relay.variables}
				onChange={props.relay.setVariables}
			/>
		</div>
	);
}

export default Relay.createContainer(BrandsTable, {
	initialVariables: {
		pageSize: 10,
		offset: 0,
		orderBy: 'NAME_ASC',
		condition: {},
	},
	fragments: {
		viewer: () => Relay.QL`
			fragment on Query {
				brands: allBrands(
					first: $pageSize,
					offset: $offset,
					orderBy: $orderBy,
					condition: $condition,
				) {
					edges {
						node {
							uuid,
							name,
							url,
						},
					},
					totalCount,
				}
			}
		`,
	},
});
