import config from "@/config/procedures.js";

const allProceduresHelper = {
	isTouchCardBySelectedTime(selectedTime, duration, state) {
		const [currentProcedure] = state.currentProcedure;
		let isTouch = false;

		state.newProcedures
			.filter(([card, isSelected]) => card.day === currentProcedure.day && !isSelected)
			.forEach(([card]) => {
				if (isTouch) {
					return;
				}

				const startSegment = (card.hour - duration);
				const finishSegment = card.hour + card.type.duration + duration;

				isTouch = (startSegment < selectedTime && finishSegment > selectedTime + duration)
					|| (selectedTime < startSegment && selectedTime + duration > finishSegment);
			});

		return isTouch;
	},

	hasFreeSpaceByCards(type, state) {
		const [currentProcedure] = state.currentProcedure;
		let hasSpace = false;

		state.newProcedures
			.filter(([card, isSelected]) => card.day === currentProcedure.day && !isSelected)
			.forEach(([a], i, array) => {
				if (hasSpace) {
					return;
				}

				const startSegment = a.hour - type.duration;
				const finishSegment = a.hour + a.type.duration + type.duration;

				hasSpace = array.some(([b]) => {
					const f = (!(finishSegment > b.hour) && finishSegment <= config.FINISH_WORK_TIME)
				|| (!(startSegment < b.hour + b.type.duration) && startSegment >= config.START_WORK_TIME);

					return f;
				});
			});

		return true;
	},
};

export default allProceduresHelper;