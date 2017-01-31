import _ from 'lodash';
import React from 'react';
import Relay from 'react-relay';
import { FormGroup, DropdownButton, MenuItem } from 'react-bootstrap';

class PageSize extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			pageSize: props.initial,
		};
	}

	onSelect(pageSize) {
		this.setState({
			pageSize: pageSize,
		});
		this.props.onChange(pageSize);
	}

	render() {
		return (
			<FormGroup controlId="formControlsSelect">
				<DropdownButton id="pageSize" title={`Per page: ${this.state.pageSize}`} onSelect={this.onSelect.bind(this)}>
					{_.map(
						this.props.options,
						(i) => <MenuItem key={i} eventKey={i} active={this.state.pageSize == i}>{i}</MenuItem>
					)}
				</DropdownButton>
			</FormGroup>
		);
	}
}

PageSize.propTypes = {
	options: React.PropTypes.arrayOf(React.PropTypes.number),
	initial: React.PropTypes.number,
	onChange: React.PropTypes.func.isRequired,
};

PageSize.defaultProps = {
	options: _.range(10, 51, 10),
	initial: 10,
	onChange: () => {},
};

export default PageSize;
