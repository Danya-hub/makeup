import { useState } from "react";
import { useTranslation } from "react-i18next";

import DataFormatter from "@/utils/dataFormatter.js";

function useWarning(warnings) {
	const [_warnings, setWarning] = useState(warnings);
	const { t } = useTranslation();

	function checkOnWarning(warnName) {
		let rez = null;

		if (_warnings[warnName]) {
			rez = [_warnings[warnName], true];
		} else {
			let boolean = false;

			const foundWarn = Object.values(_warnings)
				.find((warning) => {
					boolean = Boolean(warning);

					return boolean;
				});

			rez = [foundWarn, boolean];
		}

		return rez;
	}

	return [
		_warnings,
		(newValue) => {
			const [name, value] = newValue;

			DataFormatter.changeObject(
				{
					[name]: t(value),
				},
				setWarning,
			);
		},
		{
			checkOnWarning,
		},
	];
}

export default useWarning;
