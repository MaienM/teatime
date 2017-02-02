import _ from 'lodash';
import React from 'react';
import { browserHistory } from 'react-router';
import { Table as BootstrapTable } from 'react-bootstrap';

function Table(props) {
	return (
		<BootstrapTable striped hover={props.rowLink !== undefined}>
			<thead>
				<tr>
					{_(props.columns).keys().map((header) => <th key={header}>{header}</th>).value()}
				</tr>
			</thead>
			<tbody>
				{_.map(props.data, (rowData) => (
					<tr
						key={rowData.id}
						onClick={props.rowLink ? () => browserHistory.push(props.rowLink(rowData)) : null}
					>
						{_(props.columns).values().map((column) => {
							const key = _.get(column, 'key', column);
							const format = _.get(column, 'format', _.identity);
							return <td key={key}>{format(_.get(rowData, key))}</td>;
						}).value()}
					</tr>
				))}
			</tbody>
		</BootstrapTable>
	);
}

const columnKeyDef = React.PropTypes.oneOfType([
	React.PropTypes.arrayOf(React.PropTypes.string),
	React.PropTypes.string,
]);
Table.propTypes = {
	data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
	columns: React.PropTypes.objectOf(
		React.PropTypes.oneOfType([
			columnKeyDef,
			React.PropTypes.shape({
				key: columnKeyDef.isRequired,
				format: React.PropTypes.func.isRequired,
			}),
		]),
	).isRequired,
	rowLink: React.PropTypes.func,
};

Table.defaultProps = {
	rowLink: null,
};

export default Table;
