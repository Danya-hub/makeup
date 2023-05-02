const formats = {
	telephone: {
		ua: {
			code: "+380",
			template: "XXXXXXXXX",
			country: "ua",
		},
		at: {
			code: "+43",
			template: "XXXXXXXXXX",
			country: "at",
		},
	},
};

export const keys = Object.keys(formats.telephone);

export default formats;