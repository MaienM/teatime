import _ from 'lodash';
import React from 'react';
import ReactSelect from 'react-select';

import 'react-select/dist/react-select.min.css';
import './Select.scss';

class Select extends React.Component {
	static onKeyDown(event) {
		if (event.which === 27) {
			event.target.blur();
			event.preventDefault();
		}
	}

	constructor(props) {
		super(props);

		this.state = {
			value: null,
			isLoading: false,
		};

		// Get the search function
		if (props.onSearch) {
			this.search = _.debounce(props.onSearch, 250);
		}

		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
		this.doSearch = this.doSearch.bind(this);
	}

	componentWillMount() {
		// Set + broadcast the initial value
		this.onChange(this.props.value || (this.props.allowEmpty || this.props.options[0]) || null);
	}

	componentWillReceiveProps() {
		// Finish loading
		this.setState({
			isLoading: false,
		});
	}

	onBlur() {
		this.doSearch(this.state.selectedSearch);
	}

	onChange(value) {
		this.setState({ value });
		this.props.onChange(value.key ? value : null);
	}

	doSearch(search) {
		this.setState({
			isLoading: true,
		});
		this.search(search);
	}

	render() {
		return (
			<ReactSelect
				// Values
				options={_.concat(this.props.allowEmpty ? [{ key: null, label: '' }] : [], this.props.options)}
				value={this.state.value}
				valueKey="key"

				// Filtering
				matchProp="label"
				filterOptions={this.search && _.identity}
				onInputChange={this.search && this.doSearch}
				isLoading={this.search && this.state.isLoading}

				// Selecting
				onChange={this.onChange}

				// Losing focus/cancelling
				onBlur={this.onBlur}
				onInputKeyDown={Select.onKeyDown}
			/>
		);
	}
}

const optionPropType = React.PropTypes.shape({
	key: React.PropTypes.string.isRequired,
	label: React.PropTypes.string.isRequired,
});

Select.propTypes = {
	options: React.PropTypes.arrayOf(optionPropType).isRequired,
	value: optionPropType,
	onChange: React.PropTypes.func.isRequired,
	onSearch: React.PropTypes.func,
	allowEmpty: React.PropTypes.bool,
};

Select.defaultProps = {
	value: null,
	onSearch: null,
	allowEmpty: false,
};

export default Select;
