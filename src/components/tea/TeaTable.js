import React from 'react';
import { Table } from 'react-bootstrap';
import { withRouter } from 'react-router';

class TeaTable extends React.Component {
	render() {
		return (
			<Table striped hover>
				<thead>
					<tr>
						<th>Name</th>
						<th>Brand</th>
					</tr>
				</thead>
				<tbody>
					{this.props.teas.map((tea) => (
						<tr key={tea.id} onClick={() => this.props.router.replace(`/tea/${tea.uuid}`)}>
							<td>{tea.name}</td>
							<td>{tea.brand.name}</td>
						</tr>
					))}
				</tbody>
			</Table>
		);
	}
};

export default withRouter(TeaTable);
