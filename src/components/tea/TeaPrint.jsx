import _ from 'lodash';
import React from 'react';
import Relay from 'react-relay';
import { Alert, Col, ControlLabel, Button, Form, FormGroup, FormControl } from 'react-bootstrap';

// URL of the blog post with information about this library, and the install link
const INSTALL_URL = 'http://developers.dymo.com/2015/09/24/dymo-label-framework-javascript-library-2-0-open-beta-2/';

class TeaPrint extends React.Component {
	// Init the dymo framework
	static initFramework() {
		return new Promise((resolve, reject) => {
			// Check the environment
			const dymoResult = dymo.label.framework.checkEnvironment();
			if (!dymoResult.isBrowserSupported) {
				return reject('Not supported on this browser, sorry!');
			} else if (!dymoResult.isFrameworkInstalled) {
				return reject(`Dymo framework is not installed, please install from ${INSTALL_URL} and try again`);
			} else if (dymo.label.framework.init && !dymoResult.isWebServicePresent) {
				return reject('Dymo service is not running, please start it.');
			}

			// Init the framework
			if (dymo.label.framework.init) {
				dymo.label.framework.init(() => {
					resolve();
				});
			} else {
				resolve();
			}
			return null;
		});
	}

	constructor(props) {
		super(props);

		this.state = {
			error: null,
			valid: false,
			preview: null,
			printers: null,
			printer: null,
			label: props.viewer.labels.edges[0],
		};

		this.onPrinterChange = this.onPrinterChange.bind(this);
		this.onLabelChange = this.onLabelChange.bind(this);
		this.onPrintClick = this.onPrintClick.bind(this);
	}

	componentDidMount() {
		// Init the framework
		TeaPrint.initFramework()
			// Get the printers
			.then(() => dymo.label.framework.getLabelWriterPrintersAsync())
			.then((printers) => {
				// Store the printers
				this.setState({
					printers,
					printer: printers[0],
				});
			})
			.catch((err) => {
				// Something failed, so set the error
				this.setState({
					error: err,
				});
			});
	}

	componentDidUpdate() {
		if (!this.state.preview) {
			this.updatePreview();
		}
	}

	onPrinterChange(event) {
		this.setState({
			printer: _.find(this.state.printers, ['name', event.target.value]),
			preview: null,
		});
	}

	onLabelChange(event) {
		this.setState({
			label: _.find(this.props.viewer.labels.edges, ['node.uuid', event.target.value]),
			preview: null,
		});
	}

	onPrintClick() {
		const label = this.getLabel();
		if (label && this.state.printer) {
			label.print(this.state.printer.name);
		}
	}

	getLabel() {
		if (!this.state.label) {
			return null;
		}

		const tea = this.props.viewer.tea;
		const label = dymo.label.framework.openLabelXml(this.state.label.node.xml);
		label.setObjectText('TEXT_TEA', tea.name);
		label.setObjectText('TEXT_BRAND', tea.brand.name);
		label.setObjectText('TEXT_CATEGORY', tea.category.name);
		label.setObjectText('TEXT_URL', `/tea/${tea.uuid}`);
		return label;
	}

	updatePreview() {
		try {
			const label = this.getLabel();
			if (!label) {
				this.setState({
					valid: false,
					preview: <span>No label</span>,
				});
				return;
			}

			// Render the preview
			const data = label.render();
			this.setState({
				valid: true,
				preview: <img alt="Label preview" src={`data:image/png;base64,${data}`} />,
			});
		} catch (err) {
			this.setState({
				valid: false,
				preview: <span>Invalid label</span>,
			});
		}
	}

	render() {
		return (
			<div>
				{/* Errors */}
				{this.state.error && <Alert bsStyle="danger">{this.state.error}</Alert>}

				<Form horizontal>
					{/* Printer */}
					<FormGroup controlId="formControlsPrinter">
						<Col componentClass={ControlLabel} sm={2}>Printer</Col>
						<Col sm={10}>
							<FormControl
								componentClass="select"
								placeholder="select"
								value={_.get(this.state.printer, 'name', '')}
								onChange={this.onPrinterChange}
							>
								{_.map(this.state.printers, (printer) => (
									<option value={printer.name} key={printer.name}>{printer.name}</option>
								))}
							</FormControl>
						</Col>
					</FormGroup>

					{/* Label */}
					<FormGroup controlId="formControlsLabel">
						<Col componentClass={ControlLabel} sm={2}>Label</Col>
						<Col sm={10}>
							<FormControl
								componentClass="select"
								placeholder="select"
								value={_.get(this.state.label, 'node.uuid', '')}
								onChange={this.onLabelChange}
							>
								{_.map(this.props.viewer.labels.edges, (label) => (
									<option value={label.node.uuid} key={label.node.uuid}>{label.node.name}</option>
								))}
							</FormControl>
						</Col>
					</FormGroup>

					{/* Preview */}
					<FormGroup>
						<Col componentClass={ControlLabel} sm={2}>Preview</Col>
						<Col sm={10}>
							<FormControl.Static>
								{this.state.preview}
							</FormControl.Static>
						</Col>
					</FormGroup>

					{/* Print */}
					<FormGroup>
						<Col sm={2} />
						<Col sm={10}>
							<Button disabled={!this.state.valid} onClick={this.onPrintClick}>
								Print
							</Button>
						</Col>
					</FormGroup>
				</Form>
			</div>
		);
	}
}

export default Relay.createContainer(TeaPrint, {
	initialVariables: {
		uuid: null,
	},
	fragments: {
		viewer: () => Relay.QL`
			fragment on Query {
				labels: allLabels(first: 50) {
					edges {
						node {
							uuid,
							name,
							xml,
						},
					},
					totalCount,
				},
				tea: teaByUuid(uuid: $uuid) {
					name,
					brand: brandByBrandUuid {
						name,
					},
					category: categoryByCategoryUuid {
						name,
					},
				},
			}
		`,
	},
});

