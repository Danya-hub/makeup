const translate = {
	object(value, t) {
		const args = [];

		if (value) {
			const keys = Object.keys(value);

			keys.forEach((key) => {
				args[key] = t(value[key]);
			});
		}

		return args;
	},
};

export default translate;