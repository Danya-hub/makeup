import { useState } from "react";

function useWarning(warnings) {
	const [_warnings, setWarning] = useState(warnings);

	function hasWarning(warnName) {
		let rez = null;

		if (_warnings[warnName]) {
			rez = [_warnings[warnName], true];
		} else {
			let boolean = false;
			let finedWarn = Object.values(_warnings).find((warning) => (boolean = Boolean(warning)));

			rez = [finedWarn, boolean];
		}

		return rez;
	}

	return [
		_warnings,
		(newValue) => {
			const [name, value] = newValue;

			setWarning((prev) => ({
				...prev,
				[name]: value,
			}));
		},
		{
			hasWarning,
		},
	];
}

export { useWarning as default };
