import { useState, useRef } from "react";

function useDate(date) {
	const locale = date || new Date();
	const currentTime = useRef({
		year: locale.getFullYear(),
		month: locale.getMonth() + 1,
		day: locale.getDate(),
	});
	const [month, setMonth] = useState(locale.getMonth() + 1);
	const [day, setDay] = useState(locale.getDate());

	function handleChangeMonth(m) {
		if (month > m) {
			locale.setFullYear(locale.getFullYear() - (!(m % 12) ? 1 : 0));
			locale.setMonth((locale.getMonth() || 12) - 1);
		} else {
			locale.setMonth(locale.getMonth() + 1);
		}

		setMonth(m);
	}

	function handleChangeDay(day) {
		locale.setDate(day);

		setDay(day);
	}

	return {
		locale,
		currentTime,
		monthState: [month, handleChangeMonth],
		dayState: [day, handleChangeDay],
	};
}

export { useDate as default };
