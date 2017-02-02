import _ from 'lodash';
import React from 'react';
import Relay from 'react-relay';
import { PageHeader } from 'react-bootstrap';
import HeaderButtons from '../HeaderButtons';
import PageControl from '../PageControl';
import Table from '../Table';

class Teas extends React.Component {
	onPageChange(state) {
		this.props.relay.setVariables(_.pick(state, ['offset', 'pageSize']));
	}

	render() {
		return (
			<div className="teas">
				<PageHeader>
					Tea
					<HeaderButtons create="/tea/new" />
				</PageHeader>
				<Table
					data={_.map(this.props.viewer.allTeas.edges, 'node')}
					columns={{
						Name: 'name',
						Brand: 'brand.name',
					}}
					rowLink={(tea) => `/tea/${tea.uuid}`}
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
