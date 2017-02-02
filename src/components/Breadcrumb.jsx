import React from 'react';
import { browserHistory, withRouter } from 'react-router';
import { Breadcrumb as BootstrapBreadcrumb } from 'react-bootstrap';
import Breadcrumbs from 'react-router-breadcrumbs';

// Allow us to use an element as wrappingComponent, without warnings
delete Breadcrumbs.propTypes.wrappingComponent;

class Breadcrumb extends React.Component {
	static createLink(link, key, text) {
		return (
			<BootstrapBreadcrumb.Item
				key={key}
				onClick={() => browserHistory.push(link)}
				active={link === browserHistory.getCurrentLocation().pathname}
			>
				{text}
			</BootstrapBreadcrumb.Item>
		);
	}

	render() {
		return (
			<Breadcrumbs
				routes={this.props.routes}
				params={this.props.params}
				wrappingComponent={BootstrapBreadcrumb}
				createLink={Breadcrumb.createLink}
				createSeparator={null}
			/>
		);
	}
}

export default withRouter(Breadcrumb);
