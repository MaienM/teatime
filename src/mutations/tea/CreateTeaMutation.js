import Relay from 'react-relay';
import { rangeBehaviors } from 'mutations';

export default class CreateTeaMutation extends Relay.Mutation {
	static fragments = {
		brand: () => Relay.QL`
			fragment on Brand {
				id,
				uuid,
			}
		`,
		category: () => Relay.QL`
			fragment on Category {
				id,
				uuid,
			}
		`,
	};

	getMutation() {
		return Relay.QL`
			mutation {
				createTea,
			}
		`;
	}

	getVariables() {
		return {
			tea: {
				name: this.props.name,
				brandUuid: this.props.brand.uuid,
				categoryUuid: this.props.category.uuid,
			},
		};
	}

	getFatQuery() {
		return Relay.QL`
			fragment on CreateTeaPayload {
				tea,
				brandByBrandUuid {
					teasByBrandUuid,
				},
				categoryByCategoryUuid {
					teasByCategoryUuid,
				},
			}
		`;
	}

	getConfigs() {
		return [{
			type: 'REQUIRED_CHILDREN',
			children: [Relay.QL`
				fragment on CreateTeaPayload {
					tea {
						uuid,
					},
				}
			`],
		}, {
			type: 'RANGE_ADD',
			parentName: 'brandByBrandUuid',
			parentID: this.props.brand.id,
			connectionName: 'teasByBrandUuid',
			edgeName: 'teaEdge',
			rangeBehaviors,
		}, {
			type: 'RANGE_ADD',
			parentName: 'categoryByCategoryUuid',
			parentID: this.props.category.id,
			connectionName: 'teasByCategoryUuid',
			edgeName: 'teaEdge',
			rangeBehaviors,
		}];
	}

	getOptimisticResponse() {
		return {
			tea: {
				name: this.props.name,
				brandUuid: this.props.brand.uuid,
				brandByBrandUuid: {
					uuid: this.props.brand.uuid,
				},
				categoryUuid: this.props.category.uuid,
				categoryByCategoryUuid: {
					uuid: this.props.category.uuid,
				},
			},
		};
	}
}
