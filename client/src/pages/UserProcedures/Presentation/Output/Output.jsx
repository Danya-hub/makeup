import { Fragment, useState } from "react";
import types from "prop-types";

import Card from "@/pages/UserProcedures/Presentation/Card/Card.jsx";
import Navigation from "./Navigation/Navigation.jsx";
import { default as VerticalSrc } from "@/assets/image/vertical.svg";
import { default as HorizontalSrc } from "@/assets/image/horizontal.svg";

import style from "./Output.module.css";

Output.propTypes = {
	visualStyle: types.array,
	handleSwitch: types.func,
	direction: types.string,
	cards: types.array,
};

const visualStyle = [
	["horizontal", HorizontalSrc],
	["vertical", VerticalSrc],
];

const DEFAULT_STYLE_CARDS = 0;
const MAX_COUNT_CARDS_ON_PAGE = 8;

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
