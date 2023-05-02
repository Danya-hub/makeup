import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import Value from "@/utils/value.js";

import Aside from "@/components/Aside/Aside.jsx";
import Select from "@/components/UI/Form/Select/Select.jsx";
import Range from "@/components/UI/Form/Range/Range.jsx";
import Details from "@/components/UI/Details/Details.jsx";
import Search from "@/components/UI/Form/Search/Search.jsx";

import FilterActions from "./helpers/filters.js";

import style from "./Filters.module.css";

function Filters({ tempCards, setTempCard, initialCards, setPlaceholderLoaderState }) {
	const { t } = useTranslation();

	const [selectedOptions, setOption] = useState(FilterActions.default());
	const [[minPrice, maxPrice], setRangePrice] = useState([]);

	const translatedOption = FilterActions.sortKeys.map(t);
	const typeProcNames = useMemo(
		() => tempCards
			.map((proc) => proc.type.name)
			.filter((type, i, arr) => !arr.slice(0, i).includes(type)),
		[selectedOptions.range],
	);

	function handleReset() {
		setOption(FilterActions.default());
		setPlaceholderLoaderState(true);
	}

	function handleSearch(typeName) {
		const lowerTypename = typeName.toLowerCase();
		const foundProcs = initialCards
			.filter((proc) => proc.type.name.toLowerCase().includes(lowerTypename));

		setTempCard(foundProcs);
	}

	useEffect(() => {
		if (!initialCards.length) {
			return;
		}

		const filters = FilterActions.apply(initialCards, selectedOptions);

		setRangePrice([filters.minSelectedPrice, filters.maxSelectedPrice]);
		setTempCard(filters.procedures);
	}, [initialCards, selectedOptions.range, selectedOptions.sortBy, selectedOptions.types]);

	return (
		<Aside
			id={style.filters}
		>
			<button
				type="button"
				id={style.reset}
				className="button border"
				onClick={handleReset}
			>
				{t("resetFilter")}
			</button>
			<Details
				id="search"
				title={t("procedures")}
				isOpen
			>
				<Search
					isOpen
					hasMultipleOption
					values={typeProcNames}
					onSearch={handleSearch}
					onSelectOption={(typeNames) => {
						Value.changeObject(
							{
								types: typeNames,
							},
							setOption,
						);
					}}
				/>
			</Details>
			<Select
				id={style.sort}
				isAbsPos={false}
				defaultValue={t("sortBy")}
				values={translatedOption}
				onChange={(i) => {
					const key = FilterActions.sortKeys[i];

					Value.changeObject(
						{
							sortBy: key,
						},
						setOption,
					);
				}}
			/>
			<Details
				id="price"
				title={t("price")}
				isOpen
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
							setOption,
						);
					}}
				/>
			</Details>
		</Aside>
	);
}

Filters.propTypes = {
	tempCards: types.instanceOf(Array).isRequired,
	setTempCard: types.func.isRequired,
	initialCards: types.instanceOf(Array).isRequired,
	setPlaceholderLoaderState: types.func.isRequired,
};

export default Filters;
