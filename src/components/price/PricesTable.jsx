import React from 'react';
import Relay from 'react-relay';
import Table from 'components/Table';

function PricesTable(props) {
	return (
		<Table
			rows={props.viewer.prices}
			columns={{
				Amount: {
					key: 'amount',
					format: (v) => `${v} gram`,
				},
				Price: {
					key: 'price',
					format: (v) => `€${v}`,
				},
			}}
			rowLink={(price) => `/price/${price.uuid}`}
		/>
	);
}

export default Relay.createContainer(PricesTable, {
	initialVariables: {
		pageSize: 10,
		offset: 0,
		orderBy: 'AMOUNT_ASC',
		condition: {},
	},
	fragments: {
		viewer: () => Relay.QL`
			fragment on Query {
				prices: allPrices(
					first: $pageSize,
					offset: $offset,
					orderBy: $orderBy,
					condition: $condition,
				) {
					edges {
						node {
							uuid,
							price,
							amount,
						},
					},
					totalCount,
				}
			}
		`,
	},
});
