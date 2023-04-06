const allProceduresHelper = {
	isTouchCard(selectedTime, state) {
		const [currentProcedure] = state.currentProcedure;
		let rez = false;

		state.newProcedures
			.filter(([card]) => card.day === currentProcedure.day)
			.forEach(([card]) => {
				if (rez) {
					return;
				}

				const startSegment = (card.hour - currentProcedure.type.duration);
				const finishSegment = card.hour
                + (card.type.duration + currentProcedure.type.duration);

				rez = (startSegment < selectedTime
                    && finishSegment > selectedTime + currentProcedure.type.duration)
                || (selectedTime < startSegment
                    && selectedTime + currentProcedure.type.duration > finishSegment);
			});

		return rez;
	},
};

export default allProceduresHelper;