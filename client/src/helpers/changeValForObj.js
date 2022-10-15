function addNewProp({ key, callback, value, writtingType = "single" }) {
	let changedValue = {
		[key.target?.name || key.id || key]: key.target?.value || value,
	};

	if (writtingType === "several") {
		changedValue = value;
	}

	callback((prev) => ({
		...prev,
		...changedValue,
	}));
}

export { addNewProp as default };
