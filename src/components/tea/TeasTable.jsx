import React from 'react';
import Relay from 'react-relay';
import Table from 'components/Table';

function TeasTable(props) {
	return (
		<Table
			rows={props.viewer.teas}
			columns={{
				Name: 'name',
				Brand: 'brand.name',
			}}
			rowLink={(tea) => `/tea/${tea.uuid}`}
		/>
	);
}

export default Relay.createContainer(TeasTable, {
	initialVariables: {
		pageSize: 10,
		offset: 0,
		orderBy: 'CREATED_AT_DESC',
		condition: {},
	},
	fragments: {
		viewer: () => Relay.QL`
			fragment on Query {
				teas: allTeas(
					first: $pageSize,
					offset: $offset,
					orderBy: $orderBy,
					condition: $condition,
				) {
					edges {
						node {
							uuid,
							name,
							brand: brandByBrandUuid {
								name,
							},
						},
					},
					totalCount,
				}
			}
		`,
	},
});
