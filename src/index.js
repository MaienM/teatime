// import 'babel-polyfill';

import Teas from './components/Teas';
import AppHomeQuery from './queries/AppHomeQuery';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import { Grid, Row, Col } from 'react-bootstrap';

// import 'bootstrap/dist/css/bootstrap.min.css'

ReactDOM.render(
	<Grid>
		<Row>
			<Col xs={12} md={12}>
				<Relay.Renderer
					environment={Relay.Store}
					Container={Teas}
					queryConfig={new AppHomeQuery()}
				/>
			</Col>
		</Row>
	</Grid>,
	document.getElementById('root')
);
