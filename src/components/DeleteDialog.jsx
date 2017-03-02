import React from 'react';
import Relay from 'react-relay';
import { Button, Modal } from 'react-bootstrap';
import { browserHistory } from 'react-router';
import { element } from 'helpers/react/propTypes';

class DeleteDialog extends React.Component {
	static doCancel() {
		browserHistory.goBack();
	}

	constructor(props) {
		super(props);

		this.state = {
			isEnabled: false,
		};
		setTimeout(() => this.setState({ isEnabled: true }), 2500);

		this.doDelete = this.doDelete.bind(this);
	}

	doDelete() {
		Relay.Store.commitUpdate(this.props.mutation);
		browserHistory.replace(this.props.landingPage);
	}

	render() {
		return (
			<Modal
				onHide={DeleteDialog.doCancel}
				backdrop
				show
			>
				<Modal.Header>
					<Modal.Title>
						Are you sure you want to delete this?
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{this.props.children}
					<p><strong>This action is irreversible.</strong></p>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={DeleteDialog.doCancel}>
						Cancel
					</Button>
					<Button
						onClick={this.doDelete}
						bsStyle={this.state.isEnabled ? 'danger' : 'default'}
						disabled={!this.state.isEnabled}
					>
						Delete
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}

DeleteDialog.propTypes = {
	mutation: React.PropTypes.instanceOf(Relay.Mutation).isRequired,
	landingPage: React.PropTypes.string,
	children: element,
};

DeleteDialog.defaultProps = {
	landingPage: '/',
	children: null,
};

export default DeleteDialog;
