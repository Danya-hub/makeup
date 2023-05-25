import types from "prop-types";

import Empty from "./Empty/Empty.jsx";
import Output from "./Output/Output.jsx";

import style from "./Presentation.module.css";

function Presentation({ tempCards, initialCards }) {
	return (
		<div id={style.presentation}>
			{initialCards.length === 0
				? <Empty />
				: <Output cards={tempCards} />}
		</div>
	);
}

Presentation.propTypes = {
	tempCards: types.instanceOf(Array).isRequired,
	initialCards: types.instanceOf(Array).isRequired,
};

export default Presentation;
