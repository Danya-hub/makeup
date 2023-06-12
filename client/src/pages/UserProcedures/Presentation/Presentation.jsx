import { useState } from "react";
import types from "prop-types";

import Empty from "./Empty/Empty.jsx";
import Output from "./Output/Output.jsx";
import TopNavigation from "./Output/TopNavigation/TopNavigation.jsx";

import cardStyles from "./Output/TopNavigation/constants/cardStyles.js";
import { DEFAULT_CARDS_STYLE } from "./Output/constants/defaultValues.js";

import style from "./Presentation.module.css";

function Presentation({
	tempCards,
	initialCards,
}) {
	const [[position], setPosition] = useState(cardStyles[DEFAULT_CARDS_STYLE]);

	return (
		<div id={style.presentation}>
			<TopNavigation
				position={position}
				setPosition={setPosition}
			/>
			{initialCards.length === 0
				? <Empty />
				: (
					<Output
						cards={tempCards}
						position={position}
					/>
				)}
		</div>
	);
}

Presentation.propTypes = {
	tempCards: types.instanceOf(Array).isRequired,
	initialCards: types.instanceOf(Array).isRequired,
};

export default Presentation;
