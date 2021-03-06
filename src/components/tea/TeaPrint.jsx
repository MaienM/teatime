import _ from 'lodash';
import React from 'react';
import Relay from 'react-relay';
import { Col, ControlLabel, Button, Form, FormGroup, FormControl } from 'react-bootstrap';
import wrap from 'wrap-ansi';
import Select from 'components/Select';
import Dymo, { DymoStatus, DymoLabel, DymoLabelPreview } from 'helpers/dymo';

function getDimensions(text) {
	const lines = _.split(text, '\n');
	return [_.maxBy(lines, 'length').length, lines.length];
}

/**
 * Attempts to wrap the text as to fit in the given width/lines.
 *
 * If it is not possible to do so, it will make the lines longer and/or add more lines in a way that keeps the original
 * "aspect ratio" of width:height as closely as possible, so that when the font size is decreased the area used will be
 * as close to the original as possible.
 */
function wrapTextScaling(text, width, height) {
	// First just attempt a regular wrap, without any fancy extras
	const simpleLines = wrap(text, width);
	if (_.split(simpleLines, '\n').length <= height) {
		return simpleLines;
	}

	// That didn't work, so calculate the ratio, make a bunch of attempts, and return the one closest to the ratio
	const desiredRatio = width / height;
	return _(_.range(width, text.length))
		.map((w) => wrap(text, w))
		.sortBy((t) => {
			const diff = _.divide(...getDimensions(t)) - desiredRatio;
			// Prefer going above rather than below the ratio, because text is taller than it is wide
			return diff > 0 ? diff : diff * -2.4;
		})
		.head();
}

class TeaPrint extends React.Component {
	constructor(props) {
		super(props);

		// Create the framework
		const dymo = new Dymo();

		// Create + initialize the label
		const tea = props.viewer.tea;
		const label = new DymoLabel();
		label.setData({
			TEXT_TEA: (lbl) => {
				const origText = lbl.label.getObjectText('TEXT_TEA');
				const dimensions = getDimensions(origText);
				return wrapTextScaling(tea.name, ...dimensions);
			},
			TEXT_BRAND: tea.brand.name,
			TEXT_CATEGORY: tea.category.name,
			TEXT_URL: `/tea/${tea.uuid}`,
		});

		// Set the state
		this.state = {
			printers: null,
			currentPrinter: null,
			labels: _.map(props.viewer.labels.edges, 'node'),
			currentLabel: null,
			dymo,
			label,
		};

		// Init the framework
		dymo.init().then(() => {
			this.setState({
				dymo,
				printers: dymo.printers,
				currentPrinter: null,
			});
		});

		this.onPrinterChange = this.onPrinterChange.bind(this);
		this.onLabelChange = this.onLabelChange.bind(this);
		this.onPrintClick = this.onPrintClick.bind(this);
	}

	componentWillUpdate(nextProps, nextState) {
		nextState.label.setXML(_.get(nextState.currentLabel, 'xml', null));
	}

	onPrinterChange(printer) {
		this.setState({
			currentPrinter: printer,
		});
	}

	onLabelChange(label) {
		this.setState({
			currentLabel: label,
		});
	}

	onPrintClick() {
		const label = this.state.label;
		if (label && label.valid && this.state.currentPrinter) {
			label.print(this.state.currentPrinter.name);
		}
	}

	render() {
		return (
			<div>
				{/* Framework status */}
				<DymoStatus dymo={this.state.dymo} />

				{this.state.dymo.valid && (
					<Form horizontal>
						{/* Printer */}
						<FormGroup controlId="formControlsPrinter">
							<Col componentClass={ControlLabel} sm={2}>Printer</Col>
							<Col sm={10}>
								<Select
									options={this.state.printers}
									value={this.state.currentPrinter}
									keyProp="name"
									labelProp="name"
									onChange={this.onPrinterChange}
								/>
							</Col>
						</FormGroup>

						{/* Label */}
						<FormGroup controlId="formControlsLabel">
							<Col componentClass={ControlLabel} sm={2}>Label</Col>
							<Col sm={10}>
								<Select
									options={this.props.viewer.labels}
									value={this.state.currentLabel}
									onChange={this.onLabelChange}
									onSearch={(s) => this.props.relay.setVariables({ label: s })}
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
				)}
			</div>
		);
	}
}

export default Relay.createContainer(TeaPrint, {
	initialVariables: {
		uuid: null,
		label: '',
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

