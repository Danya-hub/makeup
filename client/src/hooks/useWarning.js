import { useState } from "react";
import { useTranslation } from "react-i18next";

function useWarning(warnings) {
	const [_warnings, setWarning] = useState(warnings);
	const { t } = useTranslation();

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
				[name]: t(value),
			}));
		},
		{
			hasWarning,
		},
	];
}

export { useWarning as default };
