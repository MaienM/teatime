import _ from 'lodash';
import React from 'react';
import { browserHistory } from 'react-router';
import { Table as BootstrapTable } from 'react-bootstrap';
import { allowNull, arrayOrConnection, buildPropType, nestedShape } from 'helpers/react/propTypes';

/* eslint-disable jsx-a11y/no-static-element-interactions */
function Table(props) {
	const { keyProp } = props; // When using it directly, eslint claims it's unused?
	return (
		<BootstrapTable striped hover={props.rowLink !== undefined}>
			<thead>
				<tr>
					{_(props.columns).keys().map((header) => <th key={header}>{header}</th>).value()}
				</tr>
			</thead>
			<tbody>
				{_.map(arrayOrConnection.transform(props.rows), (rowData) => (
					<tr
						key={rowData[keyProp]}
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
/* eslint-enable jsx-a11y/no-static-element-interactions */

const columnKeyDef = React.PropTypes.oneOfType([
	React.PropTypes.arrayOf(React.PropTypes.string),
	React.PropTypes.string,
]);
Table.propTypes = {
	rows: buildPropType((props) => {
		// Build the shape
		const shape = {};
		_(props.columns).values().map((c) => _.get(c, 'key', c)).each((k) => {
			_.set(shape, k, allowNull(React.PropTypes.any).isRequired);
		});
		// Verify it as a nested shape array/connection
		return arrayOrConnection(nestedShape(shape).isRequired);
	}).isRequired,
	columns: React.PropTypes.objectOf(
		React.PropTypes.oneOfType([
			columnKeyDef,
			React.PropTypes.shape({
				key: columnKeyDef.isRequired,
				format: React.PropTypes.func.isRequired,
			}),
		]),
	).isRequired,
	keyProp: React.PropTypes.string,
	rowLink: React.PropTypes.func,
};

Table.defaultProps = {
	keyProp: 'uuid',
	rowLink: null,
};

export default Table;
