import _ from 'lodash';
import React from 'react';
import Relay from 'react-relay';
import { Col, ControlLabel, Button, Form, FormGroup, FormControl } from 'react-bootstrap';
import Select from '../Select';
import Dymo, { DymoStatus, DymoLabel, DymoLabelPreview } from '../../dymo';

class TeaPrint extends React.Component {
	constructor(props) {
		super(props);

		// Create the framework
		const dymo = new Dymo();

		// Create + initialize the label
		const tea = props.viewer.tea;
		const label = new DymoLabel();
		label.setData({
			TEXT_TEA: tea.name,
			TEXT_BRAND: tea.brand.name,
			TEXT_CATEGORY: tea.category.name,
			TEXT_URL: `/tea/${tea.uuid}`,
		});

		// Set the state
		this.state = {
			printers: null,
			currentPrinter: null,
			labels: _.map(props.viewer.labels.edges, 'node'),
			currentLabel: props.viewer.labels.edges[0].node,
			dymo,
			label,
		};

		this.onPrinterChange = this.onPrinterChange.bind(this);
		this.onLabelChange = this.onLabelChange.bind(this);
		this.onPrintClick = this.onPrintClick.bind(this);
	}

	componentDidMount() {
		// Init the framework
		this.state.dymo.init().then(() => {
			const dymo = this.state.dymo;
			this.setState({
				dymo,
				printers: dymo.printers,
				currentPrinter: dymo.printers[0],
			});
		});
	}

	componentWillUpdate(nextProps, nextState) {
		nextState.label.setXML(_.get(nextState.currentLabel, 'xml', null));
	}

	onPrinterChange(item) {
		this.setState({
			currentPrinter: _.get(item, 'data'),
		});
	}

	onLabelChange(item) {
		this.setState({
			currentLabel: _.get(item, 'data'),
		});
	}

	onPrintClick() {
		const label = this.state.label;
		if (label && label.valid && this.state.printer) {
			label.print(this.state.printer.name);
		}
	}

	render() {
		return (
			<div>
				{/* Framework status */}
				<DymoStatus dymo={this.state.dymo} />

				<Form horizontal>
					{/* Printer */}
					<FormGroup controlId="formControlsPrinter">
						<Col componentClass={ControlLabel} sm={2}>Printer</Col>
						<Col sm={10}>
							<Select
								options={_.map(this.state.printers, (p) => ({ key: p.name, label: p.name, data: p }))}
								value={_.get(this.state.printer, 'name')}
								onChange={this.onPrinterChange}
							/>
						</Col>
					</FormGroup>

					{/* Label */}
					<FormGroup controlId="formControlsLabel">
						<Col componentClass={ControlLabel} sm={2}>Label</Col>
						<Col sm={10}>
							<Select
								options={_.map(this.state.labels, (l) => ({ key: l.uuid, label: l.name, data: l }))}
								value={_.get(this.state.label, 'uuid')}
								onChange={this.onLabelChange}
							/>
						</Col>
					</FormGroup>

					{/* Preview */}
					<FormGroup>
						<Col componentClass={ControlLabel} sm={2}>Preview</Col>
						<Col sm={10}>
							<FormControl.Static>
								{this.state.dymo.valid ?
									<DymoLabelPreview label={this.state.label} /> :
									<span>Unavailable</span>
								}
							</FormControl.Static>
						</Col>
					</FormGroup>

					{/* Print */}
					<FormGroup>
						<Col sm={2} />
						<Col sm={10}>
							<Button disabled={!this.state.label.isValid()} onClick={this.onPrintClick}>
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

