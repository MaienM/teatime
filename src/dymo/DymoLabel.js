import _ from 'lodash';

class DymoLabel {
	constructor() {
		this.xml = null;
		this.label = null;
		this.data = null;
		this.preview = null;
	}

	setXML(value) {
		this.xml = value;
		this.update();
	}

	setData(value) {
		this.data = value;
		this.update();
	}

	update() {
		try {
			// Update the label
			this.label = dymo.label.framework.openLabelXml(this.xml);

			// Set the label data
			_.map(this.data, (value, key) => {
				if (_.isFunction(value)) {
					this.label.setObjectText(key, value(this));
				} else {
					this.label.setObjectText(key, value);
				}
			});

			// Render the preview.
			this.preview = this.label.render();
		} catch (err) {
			this.preview = null;
		}
	}

	print(printer) {
		if (!this.isValid()) {
			return;
		}
		this.label.print(printer);
	}

	isSet() {
		return !!this.label;
	}

	isValid() {
		return !!this.preview;
	}
}

export default DymoLabel;
