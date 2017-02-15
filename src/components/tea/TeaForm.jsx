import _ from 'lodash';
import React from 'react';
import Relay from 'react-relay';
import { PageHeader, Form, FormGroup, ControlLabel } from 'react-bootstrap';
import Select from 'react-select';

class TeaForm extends React.Component {
	static edgesToOptions(edges) {
		return _.map(edges, (edge) => ({
			label: edge.node.name,
			value: edge.node.uuid,
		}));
	}

	render() {
		const tea = this.props.viewer.tea;

		return (
			<div>
				<PageHeader>New tea</PageHeader>
				<Form horizontal>
					<FormGroup controlId="formControlsBrands">
						<ControlLabel>Brand</ControlLabel>
						<Select
							id="formControlsBrands"
							matchProp="label"
							options={TeaForm.edgesToOptions(this.props.viewer.brands.edges)}
						/>
					</FormGroup>
				</Form>
				<pre>
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
					brandUuid,
					categoryUuid,
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

