import types from "prop-types";

import { default as LeftArrowSrc } from "@/assets/image/leftArrow.svg";
import { default as RightArrowSrc } from "@/assets/image/rightArrow.svg";
import WidthInput from "@/components/UI/Form/WidthInput/WidthInput.jsx";

import Check from "@/helpers/check.js";

import style from "./Navigation.module.css";

Navigation.propTypes = {
	countPages: types.number,
	numberPageState: types.array,
	maxCards: types.number,
};

const MAX_COUNT_BUTTONS = 4;

function Navigation({ countPages, numberPageState }) {
	const minPage = 1,
		maxPage = countPages;

	const [numberPage, setNumberPage] = numberPageState;
	const countBtns = MAX_COUNT_BUTTONS > maxPage ? maxPage : MAX_COUNT_BUTTONS;

	const minCountChangeableBtns = 0,
		maxCountChangeableBtns = maxPage - countBtns;
	const integer = numberPage < maxCountChangeableBtns ? numberPage : maxCountChangeableBtns;

	function handleClickOnPage(i) {
		if (numberPage + i < 0 || numberPage + i > maxPage - 1) {
			return;
		}

		setNumberPage((page) => page + i);
	}

	function handleChangePage(callback, e) {
		const value = e.currentTarget.value;
		const isValid = Check.isNumber(value) && callback(value);

		setNumberPage((_val) => (isValid ? value - 1 : _val));
	}

	function clearField(e) {
		e.currentTarget.value = "";
	}

	return (
		<div className={style.navigation}>
			<button
				id="prev"
				title="prev"
				className={style.switchBtn}
				onClick={() => handleClickOnPage(-1)}
			>
				<img
					src={LeftArrowSrc}
					alt="prev"
				/>
			</button>
			{minCountChangeableBtns < integer && (
				<WidthInput
					isFitContent={false}
					value={minPage}
					type="text"
					title="Ном. страницы"
					onChange={handleChangePage.bind(
						null,
						(value) => value - 1 >= minCountChangeableBtns && value - 1 < integer
					)}
					onBlur={clearField}
					placeholder="..."
				/>
			)}
			{[...Array(countBtns)].map((_, i) => {
				const current = (numberPage < integer ? numberPage : integer) + i;

				return (
					<button
						key={"nav/" + current}
						id={current}
						className={current === numberPage ? style.selectPage : ""}
						onClick={() => setNumberPage(i)}
					>
						{current + 1}
					</button>
				);
			})}
			{integer < maxCountChangeableBtns && (
				<WidthInput
					isFitContent={false}
					value={maxPage}
					type="text"
					title="Ном. страницы"
					onChange={handleChangePage.bind(
						null,
						(value) =>
							Math.abs(maxCountChangeableBtns - numberPage - maxPage) < value && maxPage > value - 1
					)}
					onBlur={clearField}
					placeholder="..."
				/>
			)}
			<button
				id="next"
				title="next"
				className={style.switchBtn}
				onClick={() => handleClickOnPage(1)}
			>
				<img
					src={RightArrowSrc}
					alt="next"
				/>
			</button>
		</div>
	);
}

export { Navigation as default };
