import _ from 'lodash';
import React from 'react';
import ReactSelect from 'react-select';
import debouncePromise from 'debounce-promise';

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
			selected: null,
			selectedSearch: '',
			options: [],
			search: '',
			isLoading: false,
		};

		// Get the search function
		if (_.isFunction(props.data)) {
			this.search = debouncePromise(props.data, 250);
		} else {
			this.search = () => Promise.resolve(props.data);
		}

		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
		this.doSearch = this.doSearch.bind(this);
	}

	componentWillMount() {
		// Load the initial options
		this.doSearch(_.get(this.props.value, 'label', '')).then((options) => {
			// Get the selected option
			let selected = _.find(options, ['key', _.get(this.props.value, 'key', null)]);
			if (!this.props.allowEmpty && !selected) {
				selected = options[0];
			}
			this.onChange(selected);
		});
	}

	onBlur() {
		this.doSearch(this.state.selectedSearch);
	}

	onChange(option) {
		this.setState({
			selected: option.key,
			selectedSearch: this.state.search,
		});
		this.props.onChange(option.key ? option : null);
	}

	async doSearch(search) {
		this.setState({
			isLoading: true,
		});

		// Load the options
		const options = await this.search(search);

		this.setState({
			options,
			search,
			isLoading: false,
		});

		// Return the new options
		return options;
	}

	render() {
		return (
			<ReactSelect
				// Values
				options={_.concat(this.props.allowEmpty ? [{ key: null, label: '' }] : [], this.state.options)}
				value={this.state.selected}
				valueKey="key"

				// Filtering
				matchProp="label"
				filterOptions={_.identity}
				onInputChange={this.doSearch}
				isLoading={this.state.isLoading}

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
	data: React.PropTypes.oneOfType([
		React.PropTypes.arrayOf(optionPropType),
		React.PropTypes.func,
	]).isRequired,
	value: optionPropType,
	onChange: React.PropTypes.func.isRequired,
	allowEmpty: React.PropTypes.bool,
};

Select.defaultProps = {
	value: null,
	allowEmpty: false,
};

export default Select;
