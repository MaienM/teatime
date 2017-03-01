import _ from 'lodash';
import React from 'react';
import Relay from 'react-relay';
import Table from 'components/Table';

function SteepAdvicesTable(props) {
	return (
		<Table
			rows={props.rows.steepAdvices}
			columns={{
				Name: 'name',
				Amount: {
					key: 'amount',
					format: (v) => `${_.uniq([v.start.v, v.end.v]).join('-')} gram`,
				},
				Temperature: {
					key: 'temperature',
					format: (v) => `${_.uniq([v.start.v, v.end.v]).join('-')}°`,
				},
				Duration: {
					key: 'duration',
					format: (v) => `${_.uniq([v.start.v, v.end.v]).join('-')} seconds`,
				},
			}}
			rowLink={(steepAdvice) => `/steepAdvice/${steepAdvice.uuid}`}
		/>
	);
}

SteepAdvicesTable.propTypes = {
	rows: React.PropTypes.shape({
		steepAdvices: Table.propTypes.rows.isRequired,
	}).isRequired,
};

export default Relay.createContainer(SteepAdvicesTable, {
	initialVariables: {
		pageSize: 10,
		offset: 0,
		orderBy: 'NAME_ASC',
		condition: {},
	},
	fragments: {
		rows: () => Relay.QL`
			fragment on Query {
				steepAdvices: allSteepAdvices(
					first: $pageSize,
					offset: $offset,
					orderBy: $orderBy,
					condition: $condition,
				) {
					edges {
						node {
							uuid,
							name,
							amount {
								start { v: value },
								end { v: value },
							},
							duration {
								start { v: value },
								end { v: value },
							},
							temperature {
								start { v: value },
								end { v: value },
							},
						},
					},
					totalCount,
				}
			}
		`,
	},
});
