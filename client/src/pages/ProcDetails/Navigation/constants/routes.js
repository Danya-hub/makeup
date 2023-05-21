const routes = [
	{
		path: (procedure) => `/details/${procedure.id}`,
		text: "aboutProcedure",
	},
	{
		path: (procedure) => `/details/comments/${procedure.id}`,
		text: "comments",
	},
];

export default routes;