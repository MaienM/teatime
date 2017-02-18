import React from 'react';
import Relay from 'react-relay';
import { Button, Modal } from 'react-bootstrap';
import { browserHistory } from 'react-router';
import TeaDeleteMutation from 'mutations/TeaDeleteMutation';

class TeaDelete extends React.Component {
	static doCancel() {
		browserHistory.goBack();
	}

	constructor(props) {
		super(props);

		this.doCancel = TeaDelete.doCancel;
		this.doDelete = this.doDelete.bind(this);
	}

	doDelete() {
		Relay.Store.commitUpdate(new TeaDeleteMutation({ tea: this.props.viewer.tea }));
		browserHistory.replace('/tea');
	}

	render() {
		const tea = this.props.viewer.tea;

		return (
			<Modal
				onHide={this.doCancel}
				backdrop
				show
			>
				<Modal.Header>
					<Modal.Title>
						Are you sure you want to delete {tea.name}?
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					This action is irreversible.
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={this.doCancel}>
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

export default Relay.createContainer(TeaDelete, {
	initialVariables: {
		uuid: null,
	},
	fragments: {
		viewer: () => Relay.QL`
			fragment on Query {
				tea: teaByUuid(uuid: $uuid) {
					name,
					${TeaDeleteMutation.getFragment('tea')},
				},
			}
		`,
	},
});
