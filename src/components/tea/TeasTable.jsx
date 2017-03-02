import React from 'react';
import Relay from 'react-relay';
import Table from 'components/Table';
import TableControl from 'components/TableControl';

function TeasTable(props) {
	return (
		<div>
			<Table
				rows={props.viewer.teas}
				columns={{
					Name: 'name',
					Brand: 'brand.name',
				}}
				rowLink={(tea) => `/tea/${tea.uuid}`}
			/>
			<TableControl
				totalCount={props.viewer.teas.totalCount}
				variables={props.relay.variables}
				onChange={props.relay.setVariables}
			/>
		</div>
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
