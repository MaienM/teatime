import Relay from 'react-relay';

export default class DeleteTeaMutation extends Relay.Mutation {
	static fragments = {
		tea: () => Relay.QL`
			fragment on Tea {
				id,
				brandByBrandUuid {
					id,
				},
				categoryByCategoryUuid {
					id,
				},
			}
		`,
	};

	getMutation() {
		return Relay.QL`
			mutation {
				deleteTea,
			}
		`;
	}

	getVariables() {
		return {
			id: this.props.tea.id,
		};
	}

	getFatQuery() {
		return Relay.QL`
			fragment on DeleteTeaPayload {
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
			type: 'NODE_DELETE',
			parentName: 'brandByBrandUuid',
			parentID: this.props.tea.brandByBrandUuid.id,
			connectionName: 'teasByBrandUuid',
			deletedIDFieldName: 'deletedTeaId',
		}, {
			type: 'NODE_DELETE',
			parentName: 'categoryByCategoryUuid',
			parentID: this.props.tea.categoryByCategoryUuid.id,
			connectionName: 'teasByCategoryUuid',
			deletedIDFieldName: 'deletedTeaId',
		}];
	}

	getOptimisticResponse() {
		return null;
	}
}
