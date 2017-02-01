import _ from 'lodash';
import React from 'react';
import { browserHistory } from 'react-router';
const BootstrapTable = require('react-bootstrap').Table;

const THead = (props) => (
	<thead>
		<tr>
			{_.map(props.headers, (header) => (
				<th key={header}>{header}</th>
			))}
		</tr>
	</thead>
);

const TBody = (props) => (
	<tbody>
		{_.map(props.data, (rowData, i) => (
			<TRow
				key={rowData.id || i}
				data={rowData} 
				columns={props.columns}
				rowLink={props.rowLink}
			/>
		))}
	</tbody>
);

const TRow = (props) => (
	<tr onClick={props.rowLink ? () => browserHistory.push(props.rowLink(props.data)) : null}>
		{_.map(props.columns, (column) => (
			<TCell
				key={column}
				data={props.data}
				column={column}
			/>
		))}
	</tr>
);

const TCell = (props) => {
	let column = props.column;
	if (!_.isObject(column)) {
		column = { key: column, format: _.identity };
	}
	return (
		<td>
			{column.format(_.get(props.data, column.key))}
		</td>
	);
};

class Table extends React.Component {
	render() {
		return (
			<BootstrapTable striped hover={this.props.rowLink !== undefined}>
				<THead
					headers={_.keys(this.props.columns)}
				/>
				<TBody
					data={this.props.data}
					columns={_.values(this.props.columns)}
					rowLink={this.props.rowLink}
				/>
			</BootstrapTable>
		);
	}
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
		])
	).isRequired,
	rowLink: React.PropTypes.func,
};

export default Table;
