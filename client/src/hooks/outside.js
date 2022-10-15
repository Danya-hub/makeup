function onOutside(events) {
	let obj = {};

	Object.entries(events).forEach((arr) => {
		const [eventName, handlersObj] = arr;

		obj[eventName] = (e) => {
			Object.keys(handlersObj).forEach((nameEl) => {
				const el = document.getElementById(nameEl);
				if (!el || el.contains(e.target) || !handlersObj[nameEl]) {
					return;
				}

				handlersObj[nameEl](this);
			});
		};
	});

	return obj;
}

export { onOutside as default };
