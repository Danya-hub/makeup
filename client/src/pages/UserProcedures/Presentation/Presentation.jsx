import types from "prop-types";

import EmptyProc from "./EmptyProc/EmptyProc.jsx";
import NotFound from "./NotFound/NotFound.jsx";
import Output from "./Output/Output.jsx";

import style from "./Presentation.module.css";

Presentation.propTypes = {
	cards: types.array,
	initialCards: types.array,
};

function Presentation({ cards, initialCards }) {
	return (
		<div id={style.presentation}>
			{initialCards.length === 0 ? (
				<EmptyProc></EmptyProc>
			) : cards.length === 0 ? (
				<NotFound></NotFound>
			) : (
				<Output cards={cards}></Output>
			)}
		</div>
	);
}

export { Presentation as default };
