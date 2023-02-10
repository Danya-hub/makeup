class Value {
	constructor() {}

	changeObject(props, callback) {
		callback((prev) => ({
			...prev,
			...props,
		}));
	}

	fromRecursProps(keys) {
		function callback(obj, ind = 0) {
			let value = obj[keys[ind]];

			if (ind + 1 < keys.length) {
				value = callback(value, ++ind);
			}

			return value;
		}

		return callback;
	}

	fromInput(e, callback) {
		const t = e.currentTarget;

		this.changeObject(
			{
				[t.name]: t.value,
			},
			callback
		);
	}
}

export default new Value();
