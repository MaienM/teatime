import _ from 'lodash';
import React from 'react';
import { PageHeader as BootstrapPageHeader, Clearfix } from 'react-bootstrap';
import HeaderButtons from 'components/HeaderButtons';

function PageHeader(props) {
	const children = _.groupBy(props.children, (v) => v.type === HeaderButtons);
	return (
		<BootstrapPageHeader>
			<div className="pull-left">
				{children.false}
			</div>
			<div className="visible-xs visible-sm pull-left">
				{children.true}
			</div>
			<div className="visible-md visible-lg pull-right">
				{children.true}
			</div>
			<Clearfix />
		</BootstrapPageHeader>
	);
}

PageHeader.propTypes = {
	children: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
		React.PropTypes.element,
		React.PropTypes.string,
	])).isRequired,
};

export default PageHeader;
