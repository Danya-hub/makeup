function onOutside(events) {
	let obj = {};

	Object.entries(events).forEach((arr) => {
		const [eventName, eventsObj] = arr;

		obj[eventName] = (e) => {
			Object.keys(eventsObj).forEach((nameEl) => {
				const el = document.getElementById(nameEl);
				if (!el || el.contains(e.target) || !eventsObj[nameEl]) {
					return;
				}

				eventsObj[nameEl](this);
			});
		};
	});

	return obj;
}

export { onOutside as default };
