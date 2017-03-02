import React from 'react';
import Relay from 'react-relay';
import { Button, Modal } from 'react-bootstrap';
import { browserHistory } from 'react-router';

class DeleteDialog extends React.Component {
	static doCancel() {
		browserHistory.goBack();
	}

	constructor(props) {
		super(props);

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
						Are you sure you want to delete {this.props.name}?
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					This action is irreversible.
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={DeleteDialog.doCancel}>
						Cancel
					</Button>
					<Button bsStyle="danger" onClick={this.doDelete}>
						Delete
					</Button>
				</Modal.Footer>
			</Modal>
		);
	}
}

DeleteDialog.propTypes = {
	mutation: React.PropTypes.instanceOf(Relay.Mutation).isRequired,
	name: React.PropTypes.string.isRequired,
	landingPage: React.PropTypes.string,
};

DeleteDialog.defaultProps = {
	landingPage: '/',
};

export default DeleteDialog;
