import _ from 'lodash';
import Relay from 'react-relay';

export default class UpdateTeaMutation extends Relay.Mutation {
	static fragments = {
		tea: () => Relay.QL`
			fragment on Tea {
				id,
			}
		`,
	};

	getMutation() {
		return Relay.QL`
			mutation {
				updateTea,
			}
		`;
	}

	getVariables() {
		return {
			id: this.props.tea.id,
			teaPatch: _.pick(this.props, [
				'name',
				'brandUuid',
				'categoryUuid',
			]),
		};
	}

	getFatQuery() {
		return Relay.QL`
			fragment on UpdateTeaPayload {
				tea {
					name,
					brandUuid,
					brandByBrandUuid,
					categoryUuid,
					categoryByCategoryUuid,
				},
			}
		`;
	}

	getConfigs() {
		return [{
			type: 'FIELDS_CHANGE',
			fieldIDs: {
				tea: this.props.tea.id,
			},
		}];
	}

	getOptimisticResponse() {
		return {
			tea: {
				name: this.props.name,
				brandUuid: this.props.brandUuid,
				brandByBrandUuid: {
					uuid: this.props.brandUuid,
				},
				categoryUuid: this.props.categoryUuid,
				categoryByCategoryUuid: {
					uuid: this.props.categoryUuid,
				},
			},
		};
	}
}
