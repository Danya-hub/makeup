const routes = [
	{
		path: (procedure) => `/details/${procedure.id}`,
		text: "aboutProcedure",
	},
	{
		path: (procedure) => `/details/reviews/${procedure.id}`,
		text: "reviews",
	},
];

export default routes;