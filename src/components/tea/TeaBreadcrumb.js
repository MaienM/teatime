import Relay from 'react-relay';
import { withRouter } from 'react-router';

function TeaBreadcrumb(props) {
	const tea = props.viewer.tea;
	const route = props.route;
	route.name = tea.name;

	return props.children;
}

export default Relay.createContainer(withRouter(TeaBreadcrumb), {
	initialVariables: {
		uuid: null,
	},
	fragments: {
		viewer: () => Relay.QL`
			fragment on Query {
				tea: teaByUuid(uuid: $uuid) {
					name,
				},
			}
		`,
	},
});
