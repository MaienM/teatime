import React from 'react';
import Pagination from './Pagination';
import PageSize from './PageSize';

import './PageControl.scss';

class PageControl extends React.Component {
	constructor(props) {
		super(props);

		if (props.initialOffset) {
			this.state = this.calcState(
				Math.floor(props.initialOffset / props.initialPageSize),
				props.initialPageSize,
			);
		} else {
			this.state = this.calcState(props.initialPage, props.initialPageSize);
		}

		this.onPageChange = this.onPageChange.bind(this);
		this.onSizeChange = this.onSizeChange.bind(this);
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

	calcState(page, size) {
		const realPage = Math.min(page, Math.ceil(this.props.total / size));
		return {
			offset: (realPage - 1) * size,
			page: realPage,
			pageSize: size,
		};
	}

	render() {
		return (
			<div className="tt-pagination">
				<Pagination
					page={this.state.page}
					pageSize={this.state.pageSize}
					total={this.props.total}
					onChange={this.onPageChange}
				/>
				{this.props.total > this.props.pageSizes[0] && (
					<PageSize
						initial={this.state.pageSize}
						options={this.props.pageSizes}
						onChange={this.onSizeChange}
					/>
				)}
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
	initialOffset: undefined,
	initialPage: 1,
	initialPageSize: PageSize.defaultProps.initial,
	pageSizes: PageSize.defaultProps.options,
};

export default PageControl;
