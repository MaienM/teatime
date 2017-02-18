import React from 'react';
import Relay from 'react-relay';
import { Col, PageHeader, Form, FormControl, FormGroup, ControlLabel } from 'react-bootstrap';
import RelaySelect from 'components/RelaySelect';

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
	}

	onNameChange(event) {
		this.setState({
			name: event.target.value,
		});
	}

	onBrandChange(brand) {
		this.setState({
			brand,
		});
	}

	onCategoryChange(category) {
		this.setState({
			category,
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
							<RelaySelect
								relay={this.props.relay}
								connection={this.props.viewer.brands}
								value={this.state.brand}
								searchVariable="brand"
								onChange={this.onBrandChange}
							/>
						</Col>
					</FormGroup>
					{/* Category */}
					<FormGroup>
						<Col componentClass={ControlLabel} sm={2}>Category</Col>
						<Col sm={10}>
							<RelaySelect
								relay={this.props.relay}
								connection={this.props.viewer.categories}
								value={this.state.category}
								searchVariable="category"
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

