import _ from 'lodash';
import React from 'react';
import Relay from 'react-relay';
import { browserHistory } from 'react-router';
import { PageHeader, Form, FormControl, Button } from 'react-bootstrap';
import FormItem from 'components/FormItem';
import RelaySelect from 'components/RelaySelect';
import CreateTeaMutation from 'mutations/tea/CreateTeaMutation';
import UpdateTeaMutation from 'mutations/tea/UpdateTeaMutation';

class TeaForm extends React.Component {
	constructor(props) {
		super(props);

		const tea = this.props.viewer.tea;
		if (tea) {
			this.state = {
				isNew: false,
				name: tea.name,
				brand: tea.brand,
				category: tea.category,
			};
		} else {
			this.state = {
				isNew: true,
				name: '',
			};
		}

		this.onNameChange = this.onNameChange.bind(this);
		this.onBrandChange = this.onBrandChange.bind(this);
		this.onCategoryChange = this.onCategoryChange.bind(this);
		this.onSaveClick = this.onSaveClick.bind(this);
	}

	onNameChange(event) {
		this.setState({
			name: event.target.value,
		});
	}

	onBrandChange(brand) {
		this.setState({ brand });
	}

	onCategoryChange(category) {
		this.setState({ category });
	}

	onSaveClick() {
		if (this.state.isNew) {
			Relay.Store.commitUpdate(
				new CreateTeaMutation(_.pick(this.state, ['name', 'brand', 'category'])),
				{ onSuccess: (result) => browserHistory.replace(`/tea/${result.createTea.tea.uuid}`) },
			);
		} else {
			Relay.Store.commitUpdate(new UpdateTeaMutation({
				tea: this.props.viewer.tea,
				..._.pick(this.state, ['name', 'brand', 'category']),
			}));
			browserHistory.replace(`/tea/${this.props.viewer.tea.uuid}`);
		}
	}

	isValid() {
		return _(['name', 'brand.uuid', 'category.uuid'])
			.map((k) => _.get(this.state, k))
			.every();
	}

	render() {
		return (
			<div>
				<PageHeader>{this.state.isNew ? 'New tea' : 'Edit tea'}</PageHeader>
				<Form horizontal>
					{/* Name */}
					<FormItem label="Name">
						<FormControl
							placeholder="Name"
							value={this.state.name}
							onChange={this.onNameChange}
						/>
					</FormItem>
					{/* Brand */}
					<FormItem label="Brand">
						<RelaySelect
							relay={this.props.relay}
							connection={this.props.viewer.brands}
							value={this.state.brand}
							searchVariable="brandSearch"
							onChange={this.onBrandChange}
						/>
					</FormItem>
					{/* Category */}
					<FormItem label="Category">
						<RelaySelect
							relay={this.props.relay}
							connection={this.props.viewer.categories}
							value={this.state.category}
							searchVariable="categorySearch"
							onChange={this.onCategoryChange}
						/>
					</FormItem>
					{/* Save */}
					<FormItem>
						<Button disabled={!this.isValid()} onClick={this.onSaveClick}>Save</Button>
					</FormItem>
				</Form>
			</div>
		);
	}
}

export default Relay.createContainer(TeaForm, {
	initialVariables: {
		isNew: true,
		uuid: null,
		brandSearch: '',
		categorySearch: '',
	},
	prepareVariables: (prevVariables) => ({
		...prevVariables,
		isNew: !prevVariables.uuid,
	}),
	fragments: {
		viewer: () => Relay.QL`
			fragment on Query {
				tea: teaByUuid(uuid: $uuid) @skip(if: $isNew) {
					uuid,
					name,
					brand: brandByBrandUuid {
						uuid,
						name,
						${CreateTeaMutation.getFragment('brand')},
					},
					category: categoryByCategoryUuid {
						uuid,
						name,
						${CreateTeaMutation.getFragment('category')},
					},
					${UpdateTeaMutation.getFragment('tea')},
				},
				brands: getBrandsForAutocomplete(search: $brandSearch, first: 50) {
					edges {
						node {
							uuid,
							name,
							${CreateTeaMutation.getFragment('brand')},
						},
					},
					totalCount,
				},
				categories: getCategoriesForAutocomplete(search: $categorySearch, first: 50) {
					edges {
						node {
							uuid,
							name,
							${CreateTeaMutation.getFragment('category')},
						},
					},
					totalCount,
				},
			}
		`,
	},
});

