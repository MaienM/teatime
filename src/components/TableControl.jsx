import _ from 'lodash';
import React from 'react';
import PageControl from 'components/PageControl';

function TableControl(props) {
	return (
		<PageControl
			initialOffset={props.variables.offset}
			initialPageSize={props.variables.pageSize}
			total={props.totalCount}
			onChange={(v) => props.onChange(_.pick(v, ['offset', 'pageSize']))}
		/>
	);
}

TableControl.propTypes = {
	variables: React.PropTypes.shape({
		offset: React.PropTypes.number.isRequired,
		pageSize: React.PropTypes.number.isRequired,
	}).isRequired,
	totalCount: React.PropTypes.number.isRequired,
	onChange: React.PropTypes.func.isRequired,
};

export default TableControl;
