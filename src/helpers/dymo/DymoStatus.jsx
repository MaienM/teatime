import React from 'react';
import { Alert } from 'react-bootstrap';
import Dymo from './Dymo';

const LABEL_URL = 'http://www.dymo.com/en-US/online-support';
const SERVICE_URL = 'http://developers.dymo.com/2015/09/24/dymo-label-framework-javascript-library-2-0-open-beta-2/';
const INFO_URL = 'http://developers.dymo.com/2016/08/08/dymo-label-web-service-faq/';

function DymoStatus(props) {
	if (props.dymo.valid) {
		return null;
	}

	if (!props.dymo.initialized) {
		return (
			<Alert bsStyle="warning">
				Connecting to the Dymo service...
			</Alert>
		);
	}

	// According to the docs, errorDetails should contain information about the error
	// According to my testing, however, this is instead contained in a property named L
	const errorMessage = props.dymo.environment.errorDetails || props.dymo.environment.L;

	return (
		<Alert bsStyle="danger">
			<p>Unable to connect to the Dymo service. This can have the following reason(s):</p>
			<ul>
				<li>The browser is not supported.</li>
				<li>The <a href={LABEL_URL}>Dymo Label software</a> is not installed.</li>
				<li>The <a href={SERVICE_URL}>Dymo Web Service</a> is not installed or not running.</li>
				<li>There is not port available in the range needed for the web service.</li>
			</ul>
			<p>
				Please see the <a href={INFO_URL}>Dymo docs</a> about the web service for more information.
			</p>
			{errorMessage && (
				<p>
					The Dymo library reported the cause as: &quot;{errorMessage}&quot;.
					If this is not helpful, just use the above list.
				</p>
			)}
		</Alert>
	);
}

DymoStatus.propTypes = {
	dymo: React.PropTypes.instanceOf(Dymo).isRequired,
};

export default DymoStatus;
