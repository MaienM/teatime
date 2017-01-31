import _ from 'lodash';
import React from 'react';
import Relay from 'react-relay';
import PageControl from '../PageControl';
import TeaTable from './TeaTable';

class Teas extends React.Component {
	onPageChange(state) {
		this.props.relay.setVariables(_.pick(state, ['offset', 'pageSize']));
	}

	render() {
		return (
			<div className="teas">
				<h1>Tea</h1>
				<TeaTable
					teas={_.map(this.props.viewer.allTeas.edges, 'node')}
				/>
				<PageControl
					initialOffset={this.props.relay.variables.offset}
					initialPageSize={this.props.relay.variables.pageSize}
					total={this.props.viewer.allTeas.totalCount}
					onChange={this.onPageChange.bind(this)}
				/>
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
							uuid,
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
