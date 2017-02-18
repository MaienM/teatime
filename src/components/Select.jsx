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
			value: null, // Set in componentWillMount
			isLoading: false,
		};

		// Get the search function
		if (props.onSearch) {
			this.search = _.debounce(props.onSearch, 250);
		}

		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
		this.doSearch = this.doSearch.bind(this);
		this.transformItem = this.transformItem.bind(this);
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
		this.props.onChange(value);
	}

	doSearch(search) {
		this.setState({
			isLoading: true,
		});
		this.search(search);
	}

	transformItem(item) {
		return {
			value: _.get(item, this.props.keyProp, ''),
			label: _.get(item, this.props.labelProp, ''),
			item,
		};
	}

	render() {
		const options = _.clone(this.props.options);
		if (this.props.allowEmpty) {
			options.shift(null);
		}

		return (
			<ReactSelect
				// Values
				options={_.map(options, this.transformItem)}
				value={this.transformItem(this.state.value)}

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

Select.propTypes = {
	options: (props, ...args) => (
		React.PropTypes.arrayOf(React.PropTypes.shape({
			[props.keyProp]: React.PropTypes.string.isRequired,
			[props.labelProp]: React.PropTypes.string.isRequired,
		})).isRequired(props, ...args)
	),
	value: (props, ...args) => {
		let propType = React.PropTypes.shape({
			[props.keyProp]: React.PropTypes.string.isRequired,
			[props.labelProp]: React.PropTypes.string.isRequired,
		});
		if (!props.allowEmpty) {
			propType = propType.isRequired;
		}
		return propType(props, ...args);
	},
	keyProp: React.PropTypes.string,
	labelProp: React.PropTypes.string,
	onChange: React.PropTypes.func.isRequired,
	onSearch: React.PropTypes.func,
	allowEmpty: React.PropTypes.bool,
};

Select.defaultProps = {
	options: null, // Is required, but eslint doesn't detect that because it's a custom validator
	value: null,
	keyProp: 'uuid',
	labelProp: 'name',
	onSearch: null,
	allowEmpty: false,
};

export default Select;
