import { useState } from "react";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import Aside from "@/components/Aside/Aside.jsx";
import Select from "@/components/UI/Form/Select/Select.jsx";
import Range from "@/components/UI/Form/Range/Range.jsx";
import Details from "@/components/UI/Details/Details.jsx";
import Search from "@/components/UI/Form/Search/Search.jsx";

import style from "./Filters.module.css";

Filters.propTypes = {
	tempCardsState: types.array,
	initialCards: types.array,
};

const sortOptions = {
	toExpensive,
	toCheap,
};

const sortKeys = Object.keys(sortOptions);

function toExpensive(procedures) {
	const sortedProcs = procedures.sortWithCallback((a, b) => (a.type.price < b.type.price ? -1 : 1));

	return sortedProcs;
}

function toCheap(procedures) {
	const sortedProcs = procedures.sortWithCallback((a, b) => (a.type.price > b.type.price ? -1 : 1));

	return sortedProcs;
}

function byRange([min, max], procedures) {
	const rez = procedures.filter((proc) => proc.type.price >= min && proc.type.price <= max);

	return rez;
}

function Filters({ tempCardsState, initialCards }) {
	const [tempCards, setTempCard] = tempCardsState;

	const minProc = Math.minObject((obj) => obj.type.price, tempCards),
		maxProc = Math.maxObject((obj) => obj.type.price, tempCards);

	const { t } = useTranslation();

	const [isOpenSelect, setOpenSelect] = useState(false);

	function handleReset() {
		setTempCard(initialCards);
	}

	function handleSearch(procedures) {
		setTempCard(procedures);
	}

	return (
		<Aside id={style.filters}>
			<button
				id={style.reset}
				className="button border"
				onClick={handleReset}
			>
				Сбросить фильтры
			</button>
			<Details
				id="search"
				title={"Процедуры"}
				isOpen={true}
			>
				<Search
					values={initialCards}
					keys={["type", "name"]}
					onChange={handleSearch}
				></Search>
			</Details>
			<Select
				id={style.sort}
				isAbsPos={false}
				values={sortKeys.map(t)}
				strictSwitch={[isOpenSelect, setOpenSelect]}
				onChange={(i) => {
					const key = sortKeys[i];
					const procs = sortOptions[key](tempCards);

					setTempCard(procs);
				}}
			></Select>
			<Details
				id="price"
				title={"Цена"}
				isOpen={true}
			>
				<Range
					id={style.procPrice}
					min={minProc?.type?.price}
					max={maxProc?.type?.price}
					onChange={(options) => {
						const procs = byRange([options.minValue, options.maxValue], tempCards);

						setTempCard(procs);
					}}
				></Range>
			</Details>
		</Aside>
	);
}

export { Filters as default };
