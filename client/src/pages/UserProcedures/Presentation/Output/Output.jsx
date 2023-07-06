import { useState } from "react";
import types from "prop-types";

import Card from "@/pages/UserProcedures/Presentation/components/Card/Card.jsx";
import BottomNavigation from "./BottomNavigation/BottomNavigation.jsx";

import { MAX_COUNT_CARDS_ON_PAGE } from "./constants/defaultValues.js";

import style from "./Output.module.css";

function Output({
	cards,
	position,
}) {
	const countPages = Math.ceil(cards.length / MAX_COUNT_CARDS_ON_PAGE);

	const [numberPage, setNumberPage] = useState(countPages - 1);

	const countCardsOnPage = Math.min(
		MAX_COUNT_CARDS_ON_PAGE,
		cards.length - numberPage * MAX_COUNT_CARDS_ON_PAGE,
	);

	function handleSwitchPage(i) {
		setNumberPage(i);
	}

	return (
		<>
			<div className={style[position]}>
				{[...Array(countCardsOnPage)].map((_, i) => {
					const viewIndex = i + MAX_COUNT_CARDS_ON_PAGE * numberPage;

					return (
						<Card
							id={viewIndex}
							className={style.userProcedure}
							key={cards[viewIndex].id}
							procedure={cards[viewIndex]}
						/>
					);
				})}
			</div>
			<BottomNavigation
				countPages={countPages}
				numberPage={numberPage}
				changeNumberPage={handleSwitchPage}
			/>
		</>
	);
}

Output.propTypes = {
	cards: types.instanceOf(Array).isRequired,
	position: types.string.isRequired,
};

export default Output;
