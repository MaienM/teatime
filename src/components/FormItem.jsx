import React from 'react';
import { Col, FormGroup, ControlLabel } from 'react-bootstrap';

function FormItem(props) {
	return (
		<FormGroup>
			<Col componentClass={ControlLabel} sm={2}>{props.label}</Col>
			<Col sm={10}>
				{props.children}
			</Col>
		</FormGroup>
	);
}

FormItem.propTypes = {
	label: React.PropTypes.string,
	children: React.PropTypes.element.isRequired,
};

FormItem.defaultProps = {
	label: '',
};

export default FormItem;
