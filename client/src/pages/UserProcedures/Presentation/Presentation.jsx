import types from "prop-types";

import EmptyProc from "./EmptyProc/EmptyProc.jsx";
import NotFound from "./NotFound/NotFound.jsx";
import Output from "./Output/Output.jsx";

import style from "./Presentation.module.css";

Presentation.propTypes = {
	tempCards: types.array,
	initialCards: types.array,
};

function Presentation({ tempCards, initialCards }) {
	return (
		<div id={style.presentation}>
			{initialCards.length === 0 ? (
				<EmptyProc></EmptyProc>
			) : tempCards.length === 0 ? (
				<NotFound></NotFound>
			) : (
				<Output cards={tempCards}></Output>
			)}
		</div>
	);
}

export { Presentation as default };
