function changePropertyValue(props, callback) {
	callback((prev) => ({
		...prev,
		...props,
	}));
}

export { changePropertyValue as default };
