import { useState } from "react";
import { useTranslation } from "react-i18next";

import Value from "@/helpers/value.js";

function useWarning(warnings) {
	const [_warnings, setWarning] = useState(warnings);
	const { t } = useTranslation();

	function hasWarning(warnName) {
		let rez = null;

		if (_warnings[warnName]) {
			rez = [_warnings[warnName], true];
		} else {
			let boolean = false;
			let foundWarn = Object.values(_warnings).find((warning) => (boolean = Boolean(warning)));

			rez = [foundWarn, boolean];
		}

		return rez;
	}

	return [
		_warnings,
		(newValue) => {
			const [name, value] = newValue;

			Value.changeObject(
				{
					[name]: t(value),
				},
				setWarning
			);
		},
		{
			hasWarning,
		},
	];
}

export { useWarning as default };
