import _ from 'lodash';
import React from 'react';
import Relay from 'react-relay';
import { Col, PageHeader, Form, FormControl, FormGroup, ControlLabel } from 'react-bootstrap';
import Select from '../Select';

const relayQueue = [];
function relaySetVariablesAsync(relay, variables) {
	return new Promise((resolve, reject) => {
		relay.setVariables(variables, (event) => {
			if (event.aborted) {
				// If aborted, the next callback's result also is this result, so store the methods for later use
				relayQueue.push([resolve, reject]);
			} else if (event.done) {
				// Done, so resolve all queued promises
				relayQueue.push([resolve, reject]);
				_.each(relayQueue, ([res, rej]) => res());
				_.pull(relayQueue, ...relayQueue);
			} else if (event.error) {
				// Failed, so reject all queued promises
				relayQueue.push([resolve, reject]);
				_.each(relayQueue, ([res, rej]) => rej(event.error));
				_.pull(relayQueue, ...relayQueue);
			}
		});
	});
}

function edgesToOptions(edges) {
	return _.map(edges, (edge) => ({
		key: edge.node.uuid,
		label: edge.node.name,
	}));
}

class TeaForm extends React.Component {
	constructor(props) {
		super(props);

		const tea = this.props.viewer.tea;
		this.state = {
			name: tea.name,
			brand: tea.brand,
			category: tea.category,
		};

		this.onNameChange = this.onNameChange.bind(this);
		this.onBrandChange = this.onBrandChange.bind(this);
		this.onCategoryChange = this.onCategoryChange.bind(this);
		this.loadBrandOptions = this.loadBrandOptions.bind(this);
		this.loadCategoryOptions = this.loadCategoryOptions.bind(this);
	}

	onNameChange(event) {
		this.setState({
			name: event.target.value,
		});
	}

	onBrandChange(brand) {
		this.setState({
			brand: {
				uuid: brand.key,
				name: brand.label,
			},
		});
	}

	onCategoryChange(category) {
		this.setState({
			category: {
				uuid: category.key,
				name: category.label,
			},
		});
	}

	async loadBrandOptions(search) {
		await relaySetVariablesAsync(this.props.relay, { brand: search });
		return edgesToOptions(this.props.viewer.brands.edges);
	}

	async loadCategoryOptions(search) {
		await relaySetVariablesAsync(this.props.relay, { category: search });
		return edgesToOptions(this.props.viewer.categories.edges);
	}

	render() {
		return (
			<div>
				<PageHeader>New tea</PageHeader>
				<Form horizontal>
					{/* Name */}
					<FormGroup>
						<Col componentClass={ControlLabel} sm={2}>Name</Col>
						<Col sm={10}>
							<FormControl
								placeholder="Name"
								value={this.state.name}
								onChange={this.onNameChange}
							/>
						</Col>
					</FormGroup>
					{/* Brand */}
					<FormGroup>
						<Col componentClass={ControlLabel} sm={2}>Brand</Col>
						<Col sm={10}>
							<Select
								data={this.loadBrandOptions}
								value={{
									key: _.get(this.state, 'brand.uuid'),
									label: _.get(this.state, 'brand.name'),
								}}
								onChange={this.onBrandChange}
							/>
						</Col>
					</FormGroup>
					{/* Category */}
					<FormGroup>
						<Col componentClass={ControlLabel} sm={2}>Category</Col>
						<Col sm={10}>
							<Select
								data={this.loadCategoryOptions}
								value={{
									key: _.get(this.state, 'category.uuid'),
									label: _.get(this.state, 'category.name'),
								}}
								onChange={this.onCategoryChange}
							/>
						</Col>
					</FormGroup>
				</Form>
				<pre>
					{JSON.stringify(this.state, null, 2)}
					{JSON.stringify(this.props.viewer, null, 2)}
				</pre>
			</div>
		);
	}
}

export default Relay.createContainer(TeaForm, {
	initialVariables: {
		uuid: null,
		brand: '',
		category: '',
	},
	fragments: {
		viewer: () => Relay.QL`
			fragment on Query {
				tea: teaByUuid(uuid: $uuid) {
					uuid,
					name,
					brand: brandByBrandUuid {
						uuid,
						name,
					},
					category: categoryByCategoryUuid {
						uuid,
						name,
					},
				},
				brands: getBrandsForAutocomplete(search: $brand, first: 50) {
					edges {
						node {
							uuid,
							name,
						},
					},
					totalCount,
				},
				categories: getCategoriesForAutocomplete(search: $category, first: 50) {
					edges {
						node {
							uuid,
							name,
						},
					},
					totalCount,
				},
			}
		`,
	},
});

