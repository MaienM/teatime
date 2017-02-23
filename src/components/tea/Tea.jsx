import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import { PageHeader } from 'react-bootstrap';
import HeaderButtons, { HeaderButton } from 'components/HeaderButtons';

class Tea extends React.Component {
	constructor(props) {
		super(props);

		this.componentDidMount = this.updateBreadcrumb;
		this.componentDidUpdate = this.updateBreadcrumb;
	}

	updateBreadcrumb() {
		// Set the route name
		const { route, router, viewer } = this.props;
		route.name = viewer.tea.name;
		router.updateBreadcrumb();
	}

	render() {
		const tea = this.props.viewer.tea;
		return (
			<div>
				{this.props.body ? this.props.body : (
					<PageHeader>
						{tea.name}&nbsp;
						<small>
							by <Link to={`/brand/${tea.brand.uuid}`}>
								{tea.brand.name}
							</Link>
						</small>
						{this.props.children == null &&
							<HeaderButtons
								update={`/tea/${tea.uuid}/edit`}
								delete={`/tea/${tea.uuid}/delete`}
							>
								<HeaderButton action={`/tea/${tea.uuid}/print`} glyph="print">Print</HeaderButton>
							</HeaderButtons>
						}
					</PageHeader>
				)}
				{this.props.children}
			</div>
		);
	}
}

Tea.propTypes = {
	children: React.PropTypes.element,
	body: React.PropTypes.element,
};

Tea.defaultProps = {
	children: undefined,
	body: undefined,
};

export default Relay.createContainer(Tea, {
	initialVariables: {
		uuid: null,
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
				},
			}
		`,
	},
});

