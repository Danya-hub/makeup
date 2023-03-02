import { t } from "i18next";
import types from "prop-types";

import LeftArrowSrc from "@/assets/image/leftArrow.svg";
import RightArrowSrc from "@/assets/image/rightArrow.svg";
import WidthInput from "@/components/UI/Form/WidthInput/WidthInput.jsx";

import Check from "@/helpers/check.js";

import constants from "./constants.js";

import style from "./Navigation.module.css";

function Navigation({ countPages, numberPageState }) {
	const minPage = 1;
	const maxPage = countPages;

	const [numberPage, setNumberPage] = numberPageState;
	const countBtns = constants.MAX_COUNT_BUTTONS > maxPage ? maxPage : constants.MAX_COUNT_BUTTONS;

	const minCountChangeableBtns = 0;
	const maxCountChangeableBtns = maxPage - countBtns;
	const integer = numberPage < maxCountChangeableBtns ? numberPage : maxCountChangeableBtns;

	function handleClickOnPage(i) {
		if (numberPage + i < 0 || numberPage + i > maxPage - 1) {
			return;
		}

		setNumberPage((page) => page + i);
	}

	function handleChangePage(e, callback) {
		const { value } = e.currentTarget;
		const isValid = Check.isNumber(value) && callback(value);

		setNumberPage((_val) => (isValid ? value - 1 : _val));
	}

	function clearField(e) {
		e.currentTarget.value = "";
	}

	return (
		<div className={style.navigation}>
			<button
				type="button"
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
					title={t("pageNum")}
					onChange={(e) => handleChangePage(
						e,
						(value) => value - 1 >= minCountChangeableBtns && value - 1 < integer,
					)}
					onBlur={clearField}
					placeholder="..."
				/>
			)}
			{[...Array(countBtns)].map((_, i) => {
				const current = (numberPage < integer ? numberPage : integer) + i;

				return (
					<button
						type="button"
						key={current}
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
					title={t("pageNum")}
					onChange={
						(e) => handleChangePage(
							e,
							(value) => Math.abs(maxCountChangeableBtns - numberPage - maxPage) < value
							&& maxPage > value - 1,
						)
					}
					onBlur={clearField}
					placeholder="..."
				/>
			)}
			<button
				type="button"
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

Navigation.propTypes = {
	countPages: types.number.isRequired,
	numberPageState: types.instanceOf(Array).isRequired,
};

export default Navigation;
