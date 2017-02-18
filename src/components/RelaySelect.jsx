import _ from 'lodash';
import React from 'react';
import Select from './Select';

class RelaySelect extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value: this.props.value,
		};

		this.onSearch = this.onSearch.bind(this);
	}

	onSearch(query) {
		this.props.relay.setVariables({
			[this.props.searchVariable]: query,
		});
	}

	render() {
		return (
			<Select
				options={_.map(this.props.connection.edges, 'node')}
				onSearch={this.onSearch}

				value={this.props.value}
				keyProp={this.props.keyProp}
				labelProp={this.props.labelProp}
				onChange={this.props.onChange}
			/>
		);
	}
}

RelaySelect.propTypes = {
	relay: React.PropTypes.shape({
		setVariables: React.PropTypes.func,
	}).isRequired,
	connection: (props, ...args) => (
		React.PropTypes.shape({
			edges: React.PropTypes.arrayOf(React.PropTypes.shape({
				node: React.PropTypes.shape({
					[props.keyProp]: React.PropTypes.string.isRequired,
					[props.labelProp]: React.PropTypes.string.isRequired,
				}).isRequired,
			})).isRequired,
		}).isRequired(props, ...args)
	),
	searchVariable: React.PropTypes.string,

	// Passed onto Select
	value: Select.propTypes.value,
	keyProp: Select.propTypes.keyProp,
	labelProp: Select.propTypes.labelProp,
	onChange: Select.propTypes.onChange,
};

RelaySelect.defaultProps = {
	connection: null, // Is required, but eslint doesn't detect that because it's a custom validator
	searchVariable: null,

	// Passed onto Select
	value: Select.defaultProps.value,
	keyProp: Select.defaultProps.keyProp,
	labelProp: Select.defaultProps.labelProp,
	onChange: Select.defaultProps.onChange,
};

export default RelaySelect;
