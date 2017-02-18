import React from 'react';
import DymoLabel from './DymoLabel';

function DymoLabelPreview(props) {
	if (!props.label.isSet()) {
		return <span>No label</span>;
	}
	if (!props.label.isValid()) {
		return <span>Invalid label</span>;
	}
	return <img alt="Label preview" src={`data:image/png;base64,${props.label.preview}`} />;
}

DymoLabelPreview.propTypes = {
	label: React.PropTypes.instanceOf(DymoLabel).isRequired,
};

export default DymoLabelPreview;
