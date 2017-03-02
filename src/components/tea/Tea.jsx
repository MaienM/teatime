import _ from 'lodash';
import React from 'react';
import Relay from 'react-relay';
import { Link } from 'react-router';
import { PageHeader, Col, Clearfix } from 'react-bootstrap';
import indefinite from 'indefinite-article';
import HeaderButtons, { HeaderButton } from 'components/HeaderButtons';
import PricesTable from 'components/price/PricesTable';
import SteepAdvicesTable from 'components/steep_advice/SteepAdvicesTable';

function Tea(props) {
	const tea = props.viewer.tea;
	return (
		<div>
			<PageHeader>
				<Col sm={12} md={8}>
					{tea.name}
					<br />
					<small>
						{indefinite(tea.category.name)}&nbsp;
						<Link to={`/category/${tea.category.uuid}`}>{tea.category.name}</Link>
						&nbsp;tea by&nbsp;
						<Link to={`/brand/${tea.brand.uuid}`}>{tea.brand.name}</Link>
					</small>
				</Col>
				<Col sm={12} md={4}>
					<HeaderButtons
						update={`/tea/${tea.uuid}/edit`}
						delete={`/tea/${tea.uuid}/delete`}
					>
						<HeaderButton action={`/tea/${tea.uuid}/print`} glyph="print">Print</HeaderButton>
					</HeaderButtons>
				</Col>
				<Clearfix />
			</PageHeader>

			<h3>Prices</h3>
			<PricesTable viewer={props.viewer} condition={props.relay.variables.pricesCondition} />

			<h3>Steep advices</h3>
			<SteepAdvicesTable viewer={props.viewer} condition={props.relay.variables.steepAdvicesCondition} />
		</div>
	);
}

export default Relay.createContainer(Tea, {
	initialVariables: {
		uuid: null,
		pricesCondition: {},
		steepAdvicesCondition: {},
	},
	prepareVariables: (prevVariables) => {
		_.set(prevVariables, 'pricesCondition.teaUuid', prevVariables.uuid);
		_.set(prevVariables, 'steepAdvicesCondition.teaUuid', prevVariables.uuid);
		return prevVariables;
	},
	fragments: {
		viewer: (variables) => Relay.QL`
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
				${PricesTable.getFragment('viewer', { condition: variables.pricesCondition })},
				${SteepAdvicesTable.getFragment('viewer', { condition: variables.steepAdvicesCondition })},
			}
		`,
	},
});

