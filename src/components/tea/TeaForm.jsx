import _ from 'lodash';
import React from 'react';
import Relay from 'react-relay';
import { Col, PageHeader, Form, FormControl, FormGroup, ControlLabel } from 'react-bootstrap';
import Select from 'components/Select';

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
			isLoading: false,
		};

		this.onNameChange = this.onNameChange.bind(this);
		this.onBrandChange = this.onBrandChange.bind(this);
		this.onCategoryChange = this.onCategoryChange.bind(this);
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

	setRelayVariables(variables) {
		this.props.relay.setVariables(variables, (event) => {
			if (event.done || event.error) {
				this.setState({
					isLoading: false,
				});
			}
		});
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
								options={edgesToOptions(this.props.viewer.brands.edges)}
								value={{ key: this.state.brand.uuid, label: this.state.brand.name }}
								onChange={this.onBrandChange}
								onSearch={(s) => this.props.relay.setVariables({ brand: s })}
								isLoading={this.state.isLoading}
							/>
						</Col>
					</FormGroup>
					{/* Category */}
					<FormGroup>
						<Col componentClass={ControlLabel} sm={2}>Category</Col>
						<Col sm={10}>
							<Select
								options={edgesToOptions(this.props.viewer.categories.edges)}
								value={{ key: this.state.category.uuid, label: this.state.category.name }}
								onChange={this.onCategoryChange}
								onSearch={(s) => this.props.relay.setVariables({ category: s })}
								isLoading={this.state.isLoading}
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

