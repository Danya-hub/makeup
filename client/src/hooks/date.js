import { useState, useMemo, useRef } from "react";

function useDate(date) {
	const memoDate = useMemo(() => date || new Date(), [date]);
	const noChangeDate = useRef({
		year: date.getFullYear(),
		month: date.getMonth() + 1,
		day: date.getDate(),
	});
	const month = useState(memoDate.getMonth() + 1);
	const day = useState(memoDate.getDate());

	return [
		{
			memoDate,
			noChangeDate,
			month,
			day,
		},
	];
}

export { useDate as default };
