import _ from 'lodash';
import React from 'react';
import { FormControl } from 'react-bootstrap';

class Select extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			selected: this.props.value,
		};
		this.broadcastChange(this.props.value);

		this.onChange = this.onChange.bind(this);
	}

	onChange(event) {
		this.setState({
			selected: event.target.value,
		});
		this.broadcastChange(event.target.value);
	}

	broadcastChange(key) {
		const option = _.find(this.props.options, ['key' || '', key]);
		this.props.onChange(option);
	}

	render() {
		return (
			<FormControl
				componentClass="select"
				value={this.state.selected}
				onChange={this.onChange}
			>
				{this.props.allowEmpty && <option value="" />}
				{_.map(this.props.options, (option) => (
					<option key={option.key} value={option.key}>{option.label}</option>
				))}
			</FormControl>
		);
	}
}

Select.propTypes = {
	options: React.PropTypes.arrayOf(
		React.PropTypes.shape({
			key: React.PropTypes.string.isRequired,
			label: React.PropTypes.string.isRequired,
		}),
	).isRequired,
	value: React.PropTypes.string,
	allowEmpty: React.PropTypes.bool,
	onChange: React.PropTypes.func.isRequired,
};

Select.defaultProps = {
	value: undefined,
	allowEmpty: true,
};

export default Select;
