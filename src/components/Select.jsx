import _ from 'lodash';
import React from 'react';
import ReactSelect from 'react-select';
import { arrayOrConnection, buildPropType } from 'helpers/react/propTypes';

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
		const value = this.props.value || (this.props.allowEmpty || this.props.options[0]) || null;
		this.setState({ value });
		this.props.onChange(value);
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
		const item = value && value.item;
		this.setState({
			value: item,
		});
		this.props.onChange(item);
	}

	doSearch(search) {
		if (!this.search) {
			return;
		}

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
		const options = _.clone(arrayOrConnection.transform(this.props.options) || []);
		if (this.props.allowEmpty || options.length === 0) {
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

const itemPropType = buildPropType((props) => (
	React.PropTypes.shape({
		[props.keyProp]: React.PropTypes.string.isRequired,
		[props.labelProp]: React.PropTypes.string.isRequired,
	})
));
Select.propTypes = {
	options: arrayOrConnection(itemPropType).isRequired,
	value: itemPropType,
	keyProp: React.PropTypes.string,
	labelProp: React.PropTypes.string,
	onChange: React.PropTypes.func.isRequired,
	onSearch: React.PropTypes.func,
	allowEmpty: React.PropTypes.bool,
};

Select.defaultProps = {
	value: null,
	keyProp: 'uuid',
	labelProp: 'name',
	onSearch: null,
	allowEmpty: false,
};

export default Select;
