import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import Value from "@/helpers/value.js";

import Aside from "@/components/Aside/Aside.jsx";
import Select from "@/components/UI/Form/Select/Select.jsx";
import Range from "@/components/UI/Form/Range/Range.jsx";
import Details from "@/components/UI/Details/Details.jsx";
import Search from "@/components/UI/Form/Search/Search.jsx";

import { FilterOptions } from "./actions.js";

import style from "./Filters.module.css";

Filters.propTypes = {
	tempCardsState: types.array,
	initialCards: types.array,
	placeholderLoaderState: types.array,
};

function Filters({ tempCardsState, initialCards, placeholderLoaderState }) {
	const { t } = useTranslation();

	const [selectedOptions, setOption] = useState(FilterOptions.default());
	const [[minPrice, maxPrice], setRangePrice] = useState([]);

	const [, setPlaceholderLoaderState] = placeholderLoaderState;
	const [tempCards, setTempCard] = tempCardsState;
	const translatedOption = FilterOptions.sortKeys.map(t);
	const typeProcNames = useMemo(
		() =>
			tempCards
				.map((proc) => proc.type.name)
				.filter((type, i, arr) => !arr.slice(0, i).includes(type)),
		[selectedOptions.range]
	);

	function handleReset() {
		setOption(FilterOptions.default());
		setPlaceholderLoaderState(true);
	}

	function handleSearch(typeName) {
		const _typeName = typeName.toLowerCase();
		const foundProcs = initialCards.filter((proc) =>
			proc.type.name.toLowerCase().includes(_typeName)
		);

		setTempCard(foundProcs);
	}

	useEffect(() => {
		if (!initialCards.length) {
			return;
		}

		const filters = FilterOptions.apply(initialCards, selectedOptions);

		setRangePrice([filters.minSelectedPrice, filters.maxSelectedPrice]);
		setTempCard(filters.procedures);
	}, [initialCards, selectedOptions.range, selectedOptions.sortBy, selectedOptions.types]);

	return (
		<Aside id={style.filters}>
			<button
				id={style.reset}
				className="button border"
				onClick={handleReset}
			>
				{t("resetFilter")}
			</button>
			<Details
				id="search"
				title={t("procedures")}
				isOpen={true}
			>
				<Search
					isOpen={true}
					hasMultipleOption={true}
					values={typeProcNames}
					onSearch={handleSearch}
					onSelectOption={(typeNames) => {
						Value.changeObject(
							{
								types: typeNames,
							},
							setOption
						);
					}}
				></Search>
			</Details>
			<Select
				id={style.sort}
				isAbsPos={false}
				defaultValue={t("sortBy")}
				values={translatedOption}
				onChange={(i) => {
					const key = FilterOptions.sortKeys[i];

					Value.changeObject(
						{
							sortBy: key,
						},
						setOption
					);
				}}
			></Select>
			<Details
				id="price"
				title={t("price")}
				isOpen={true}
			>
				<Range
					id={style.procPrice}
					min={minPrice?.type?.price}
					max={maxPrice?.type?.price}
					onChange={(_options) => {
						const { min, max } = _options;

						Value.changeObject(
							{
								range: [min.number, max.number],
							},
							setOption
						);
					}}
				></Range>
			</Details>
		</Aside>
	);
}

export { Filters as default };
