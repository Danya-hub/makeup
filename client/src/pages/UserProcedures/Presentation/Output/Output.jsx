import { Fragment, useState } from "react";
import types from "prop-types";

import Card from "@/pages/UserProcedures/Presentation/Card/Card.jsx";
import Navigation from "./Navigation/Navigation.jsx";

import { MAX_COUNT_CARDS_ON_PAGE, visualStyle, DEFAULT_STYLE_CARDS } from "./constants.js";

import style from "./Output.module.css";

Output.propTypes = {
	cards: types.array,
};

function Output({ cards }) {
	const [[direction], setDirection] = useState(visualStyle[DEFAULT_STYLE_CARDS]);
	const [numberPage, setNumberPage] = useState(0);

	const countPages = Math.ceil(cards.length / MAX_COUNT_CARDS_ON_PAGE);
	const remainder =
			MAX_COUNT_CARDS_ON_PAGE < cards.length
				? cards.length - MAX_COUNT_CARDS_ON_PAGE * (numberPage + 1)
				: cards.length,
		countCardsOnPage =
			remainder >= 0 && MAX_COUNT_CARDS_ON_PAGE < cards.length
				? MAX_COUNT_CARDS_ON_PAGE
				: Math.abs(remainder);

	function handleSwitchStyle(i) {
		setDirection(visualStyle[i]);
	}

	function handleSwitchPage(i) {
		setNumberPage(i);
	}

	return (
		<Fragment>
			<div className={style.topPanel}>
				<div className={style.visualStyle}>
					{visualStyle.map(([dir, src], i) => (
						<button
							key={dir}
							id={dir}
							title={dir}
							className={dir === direction ? style.selectDir : ""}
							onClick={() => handleSwitchStyle(i)}
						>
							<img
								src={src}
								alt={dir}
							/>
						</button>
					))}
				</div>
			</div>
			<div className={style[direction]}>
				{[...Array(countCardsOnPage)].map((_, i) => {
					const viewIndex = i + MAX_COUNT_CARDS_ON_PAGE * numberPage;

					return (
						<Card
							id={viewIndex}
							className={style.userProcedure}
							key={cards[viewIndex]._id + "/" + i}
							procedure={cards[viewIndex]}
						></Card>
					);
				})}
			</div>
			<Navigation
				countPages={countPages}
				numberPageState={[numberPage, handleSwitchPage]}
			></Navigation>
		</Fragment>
	);
}

export { Output as default };
