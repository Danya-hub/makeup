function repeatByLimit(text, repeatSymb, limit) {
	return repeatSymb.repeat(limit - String(text).length) + text;
}

export { repeatByLimit as default };
