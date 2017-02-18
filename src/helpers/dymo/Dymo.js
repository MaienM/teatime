function isEnvironmentValid(environment) {
	return environment.isBrowserSupported && environment.isFrameworkInstalled &&
		(!dymo.label.framework.init || environment.isWebServicePresent);
}

class Dymo {
	constructor() {
		if (Dymo.instance) {
			return Dymo.instance;
		}
		Dymo.instance = this;

		this.initialized = false;
		this.environment = null;
		this.valid = false;
		this.printers = [];
	}

	async init() {
		// Prevent reinitialisation
		if (this.initialized) {
			return this;
		}

		// Check the environment
		this.environment = dymo.label.framework.checkEnvironment();
		if (!isEnvironmentValid(this.environment)) {
			this.initialized = true;
			return self;
		}

		// Init the framework
		if (dymo.label.framework.init) {
			await new Promise((resolve) => {
				dymo.label.framework.init(() => {
					resolve();
				});
			});
		}

		// Get the printers
		this.printers = await dymo.label.framework.getLabelWriterPrintersAsync();

		// Set ready and valid.
		this.valid = true;
		this.initialized = true;

		return this;
	}
}

export default Dymo;
