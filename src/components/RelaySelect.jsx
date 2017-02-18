import _ from 'lodash';
import React from 'react';
import Select from './Select';

class RelaySelect extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value: this.props.value,
		};

		this.onChange = this.onChange.bind(this);
		this.onSearch = this.onSearch.bind(this);
	}

	onChange(item) {
		this.props.onChange(_.get(item, 'node', null));
	}

	onSearch(query) {
		this.props.relay.setVariables({
			[this.props.searchVariable]: query,
		});
	}

	transformNode(node) {
		return {
			key: node[this.props.keyProp],
			label: node[this.props.labelProp],
			node,
		};
	}

	render() {
		return (
			<Select
				options={_.map(this.props.connection.edges, (e) => this.transformNode(e.node))}
				value={this.transformNode(this.state.value)}
				onChange={this.onChange}
				onSearch={this.onSearch}
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
	value: (props, ...args) => (
		React.PropTypes.shape({
			[props.keyProp]: React.PropTypes.string.isRequired,
			[props.labelProp]: React.PropTypes.string.isRequired,
		}).isRequired(props, ...args)
	),
	searchVariable: React.PropTypes.string.isRequired,
	keyProp: React.PropTypes.string.isRequired,
	labelProp: React.PropTypes.string.isRequired,
	onChange: React.PropTypes.func.isRequired,
};

RelaySelect.defaultProps = {
	connection: null, // Is required, but eslint doesn't detect that because it's a custom validator
	value: null, // Same as above
};

export default RelaySelect;
