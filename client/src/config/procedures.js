const procedures = {
	COUNTRY: "ua",
	START_WORK_TIME: 8,
	FINISH_WORK_TIME: 20,
	MAX_COUNT_PROCEDURE: 3,
};

export const states = {
	pending: {
		name: "pending",
		color: "blue",
		position: 2,
	},
	inProcess: {
		name: "inProcess",
		color: "red",
		position: 1,
	},
	finished: {
		name: "finished",
		color: "green",
		position: 3,
	},
};

export default procedures;