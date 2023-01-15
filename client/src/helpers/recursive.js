class Recursive {
	getPropValue(keys) {
		function callback(obj, ind = 0) {
			let value = obj[keys[ind]];

			if (ind + 1 < keys.length) {
				value = callback(value, ++ind);
			}

			return value;
		}

		return callback;
	}
}

export default new Recursive();
