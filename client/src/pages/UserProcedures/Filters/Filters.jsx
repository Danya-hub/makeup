import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import useOutsideEvent from "@/hooks/useOutsideEvent.js";
import changePropertyValue from "@/helpers/changePropertyValue.js";

import Aside from "@/components/Aside/Aside.jsx";
import Select from "@/components/UI/Form/Select/Select.jsx";
import Range from "@/components/UI/Form/Range/Range.jsx";

Filters.propTypes = {
	cartsState: types.array,
	isLoadingContent: types.bool,
};

const defaultFilters = () => ({
	min: null,
	max: null,
	sort: null,
});

function toExpensive(items) {
	const sortedCarts = items.sortWithCallback((a, b) => (a.type.price < b.type.price ? -1 : 1));

	return sortedCarts;
}

function toCheap(items) {
	const sortedCarts = items.sortWithCallback((a, b) => (a.type.price > b.type.price ? -1 : 1));

	return sortedCarts;
}

function Filters({ cartsState }) {
	const { t } = useTranslation();
	const ref = useOutsideEvent(handleCloseSelect);
	const [isOpenSelect, setOpenSelect] = useState(false);

	const [carts, setCarts] = cartsState;
	const initialCarts = useRef(carts);
	const sortOptions = {
		toExpensive: toExpensive(carts),
		toCheap: toCheap(carts),
	};
	const sortKeys = Object.keys(sortOptions);

	const minProc = carts.length ? Math.minObject((obj) => obj.type.price, carts) : null;
	const maxProc = carts.length ? Math.maxObject((obj) => obj.type.price, carts) : null;

	function handleCloseSelect() {
		setOpenSelect(false);
	}

	function reset() {
		setCarts(initialCarts.current);
		// setFilterOptions(defaultFilters);
	}

	return (<Aside>
		<button
			className="button"
			onClick={reset}
		>
			Сбросить фильтры
		</button>
		<Select
			ref={ref}
			values={sortKeys.map(t)}
			strictSwitch={[isOpenSelect, setOpenSelect]}
			onChange={(i) => {
				const key = sortKeys[i];
				const sortedCarts = sortOptions[key]();

				setCarts(sortedCarts);

				changePropertyValue({
					sortBy: key,
				},)
			}}
		></Select>
		<span>Цена</span>
		<Range
			id="procPrice"
			min={minProc?.type?.price}
			max={maxProc?.type?.price}
			onChange={(options) => {
				console.log(options);
			}}
		></Range>
	</Aside>
	);
}

export { Filters as default };
