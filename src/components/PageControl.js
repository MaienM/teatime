import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Pagination from './Pagination';
import PageSize from './PageSize';

import './PageControl.scss';

class PageControl extends React.Component {
	constructor(props) {
		super(props);

		if (props.initialOffset) {
			this.state = this.calcState(
				Math.floor(props.initialOffset / props.initialPageSize),
				props.initialPageSize
			);
		} else {
			this.state = this.calcState(props.initialPage, props.initialPageSize);
		}
	}

	calcState(page, size) {
		return {
			offset: (page - 1) * size,
			page: page,
			pageSize: size,
		};
	}

	onChange(page, size) {
		const newState = this.calcState(page, size);
		this.setState(newState);
		this.props.onChange(newState);
	}

	onPageChange(page) {
		this.onChange(page, this.state.pageSize);
	}

	onSizeChange(size) {
		this.onChange(Math.floor(this.state.offset / size) + 1, size);
	}

	render() {
		return (
			<div className="tt-pagination">
				<Pagination
					page={this.state.page}
					pageSize={this.state.pageSize}
					total={this.props.total}
					onChange={this.onPageChange.bind(this)}
				/>
				<PageSize
					initial={this.state.pageSize}
					options={this.state.pageSizes}
					onChange={this.onSizeChange.bind(this)}
				/>
			</div>
		);
	}
}

PageControl.propTypes = {
	initialPage: React.PropTypes.number,
	initialOffset: React.PropTypes.number,
	initialPageSize: React.PropTypes.number,
	total: React.PropTypes.number.isRequired,
	pageSizes: React.PropTypes.arrayOf(React.PropTypes.number),
	onChange: React.PropTypes.func.isRequired,
};

PageControl.defaultProps = {
	initialPage: 1,
	initialPageSize: 10,
	onChange: () => {},
};

export default PageControl;
