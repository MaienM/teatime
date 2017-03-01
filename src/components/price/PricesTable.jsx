import React from 'react';
import Relay from 'react-relay';
import Table from 'components/Table';

function PricesTable(props) {
	return (
		<Table
			rows={props.rows.prices}
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

PricesTable.propTypes = {
	rows: React.PropTypes.shape({
		prices: Table.propTypes.rows.isRequired,
	}).isRequired,
};

export default Relay.createContainer(PricesTable, {
	initialVariables: {
		pageSize: 10,
		offset: 0,
		orderBy: 'AMOUNT_ASC',
		condition: {},
	},
	fragments: {
		rows: () => Relay.QL`
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
