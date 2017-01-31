import React from 'react';
import Relay from 'react-relay';
const BootstrapPagination = require('react-bootstrap').Pagination;

class Pagination extends React.Component {
	render() {
		const pages = Math.ceil(this.props.total / this.props.pageSize);
		if (pages <= 1) return null;
		return <BootstrapPagination
			items={pages}
			activePage={this.props.page}
			onSelect={this.props.onChange}
			maxButtons={5}
			first last prev next boundaryLinks
		/>
	}
}

Pagination.propTypes = {
	page: React.PropTypes.number,
	pageSize: React.PropTypes.number,
	total: React.PropTypes.number.isRequired,
	onChange: React.PropTypes.func.isRequired,
};

Pagination.defaultProps = {
	page: 1,
	pageSize: 10,
	onChange: () => {},
};

export default Pagination;
