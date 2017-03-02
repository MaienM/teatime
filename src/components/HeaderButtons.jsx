import React from 'react';
import { ButtonGroup } from 'react-bootstrap';
import { element } from 'helpers/react/propTypes';
import HeaderButton, { actionPropType } from './HeaderButton';

function HeaderButtons(props) {
	return (
		<ButtonGroup>
			{props.children}
			{props.create && <HeaderButton action={props.create} glyph="plus">New</HeaderButton>}
			{props.update && <HeaderButton action={props.update} glyph="edit">Edit</HeaderButton>}
			{props.delete && <HeaderButton action={props.delete} glyph="trash">Remove</HeaderButton>}
		</ButtonGroup>
	);
}

HeaderButtons.propTypes = {
	create: actionPropType,
	update: actionPropType,
	delete: actionPropType,
	children: element,
};

HeaderButtons.defaultProps = {
	create: null,
	update: null,
	delete: null,
	children: null,
};

export default HeaderButtons;
export { HeaderButton };
