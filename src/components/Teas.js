import _ from 'lodash';
import React from 'react';
import Relay from 'react-relay';
import Pagination from './Pagination';
import TeaTable from './TeaTable';

class Teas extends React.Component {
	onPageChange(page) {
		this.props.relay.setVariables({
			offset: (page - 1) * this.props.relay.variables.pageSize,
		});
	}

	render() {
		return (
			<div className="teas">
				<h1>Tea</h1>
				<TeaTable
					teas={_.map(this.props.viewer.allTeas.edges, 'node')} />
				<Pagination
					page={Math.floor(this.props.relay.variables.offset / this.props.relay.variables.pageSize) + 1}
					pageSize={this.props.relay.variables.pageSize}
					total={this.props.viewer.allTeas.totalCount}
					onChange={this.onPageChange.bind(this)} />
			</div>
		);
	}
}

export default Relay.createContainer(Teas, {
	initialVariables: {
		offset: 0,
		pageSize: 10,
	},
	fragments: {
		viewer: () => Relay.QL`
			fragment on Query {
				allTeas(first: $pageSize, offset: $offset) {
					edges {
						node {
							id,
							name,
							brand: brandByBrandUuid {
								name
							}
						}
					},
					totalCount
				}
			}
		`,
	},
});
