import { useState, useMemo, useRef } from "react";

function useDate(date) {
	const memoDate = useMemo(() => date || new Date(), [date]);
	const _date = useRef({
		year: date.getFullYear(),
		month: date.getMonth() + 1,
		day: date.getDate(),
	});
	const [month, setMonth] = useState(memoDate.getMonth() + 1);
	const [day, setDay] = useState(memoDate.getDate());

	function handleChangeMonth(m) {
		if (month > m) {
			memoDate.setFullYear(memoDate.getFullYear() - (!(m % 12) ? 1 : 0));
			memoDate.setMonth((memoDate.getMonth() || 12) - 1);
		} else {
			memoDate.setMonth(memoDate.getMonth() + 1);
		}

		setMonth(m);
	}

	function handleChangeDay(day) {
		setDay(day);
		memoDate.setDate(day);
	}

	return [
		{
			memoDate,
			_date,
			monthState: [month, handleChangeMonth],
			dayState: [day, handleChangeDay],
		},
	];
}

export { useDate as default };
