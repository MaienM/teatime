import React from 'react';
import Relay from 'react-relay';
import DeleteDialog from 'components/DeleteDialog';
import DeleteTeaMutation from 'mutations/tea/DeleteTeaMutation';

function DeleteTea(props) {
	const tea = props.viewer.tea;
	return (
		<DeleteDialog
			mutation={new DeleteTeaMutation({ tea })}
			name={tea.name}
			landingPage="/tea"
		/>
	);
}

export default Relay.createContainer(DeleteTea, {
	initialVariables: {
		uuid: null,
	},
	fragments: {
		viewer: () => Relay.QL`
			fragment on Query {
				tea: teaByUuid(uuid: $uuid) {
					name,
					${DeleteTeaMutation.getFragment('tea')},
				},
			}
		`,
	},
});
