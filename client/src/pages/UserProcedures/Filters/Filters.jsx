import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import DataFormatter from "@/utils/dataFormatter.js";

import Aside from "@/components/Aside/Aside.jsx";
import Select from "@/components/UI/Form/Select/Select.jsx";
import Range from "@/components/UI/Form/Range/Range.jsx";
import Details from "@/components/UI/Details/Details.jsx";
import Search from "@/components/UI/Form/Search/Search.jsx";

import FilterActions from "./helpers/filters.js";

import style from "./Filters.module.css";

function Filters({
	tempCards,
	onChange,
	initialCards,
	setPlaceholderLoaderState,
}) {
	const { t } = useTranslation();

	const [selectedOptions, setOption] = useState(FilterActions.default());
	const [[minPrice, maxPrice], setRangePrice] = useState([]);
	const typeProcNames = useMemo(
		() => tempCards.reduce((acc, value) => {
			if (!acc.includes(value.type.name)) {
				acc.push(value.type.name);
			}

			return acc;
		}, []),
		[selectedOptions.range],
	);

	const translatedOption = FilterActions.sortKeys.map(t);

	function handleReset() {
		setOption(FilterActions.default());
		setPlaceholderLoaderState(true);
	}

	function handleSearch(typeName, setState) {
		const result = {};
		const lowerTypename = typeName.toLowerCase();

		initialCards
			.forEach((proc) => {
				const match = t(proc.type.name).toLowerCase().includes(lowerTypename);

				if (match) {
					result[proc.type.name] = proc.type.name;
				}
			});

		DataFormatter.changeObject(
			{
				types: result,
			},
			setOption,
		);
		setState(Object.keys(result));
	}

	useEffect(() => {
		if (!initialCards.length) {
			return;
		}

		const filters = FilterActions.apply(initialCards, selectedOptions);

		setRangePrice([filters.minSelectedPrice.type.price, filters.maxSelectedPrice.type.price]);
		onChange(filters.procedures);
	}, [
		initialCards,
		selectedOptions.range,
		selectedOptions.sortBy,
		selectedOptions.types,
	]);

	return (
		<Aside
			id={style.filters}
			render={() => (
				<>
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
						render={() => (
							<Search
								isOpen
								hasMultipleOption
								values={typeProcNames}
								onSearch={handleSearch}
								onSelectOption={(typeNames) => {
									DataFormatter.changeObject(
										{
											types: typeNames,
										},
										setOption,
									);
								}}
							/>
						)}
						defaultOpen
					/>
					<Select
						id={style.sort}
						isAbsPos={false}
						defaultValue={t("sortBy")}
						values={translatedOption}
						onChange={(i) => {
							const key = FilterActions.sortKeys[i];

							DataFormatter.changeObject(
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
						defaultOpen
						render={() => (
							<Range
								id={style.procPrice}
								min={minPrice}
								max={maxPrice}
								onChange={(_options) => {
									const { min, max } = _options;

									DataFormatter.changeObject(
										{
											range: [min.number, max.number],
										},
										setOption,
									);
								}}
							/>
						)}
					/>
				</>
			)}
		/>
	);
}

Filters.propTypes = {
	tempCards: types.instanceOf(Array).isRequired,
	onChange: types.func.isRequired,
	initialCards: types.instanceOf(Array).isRequired,
	setPlaceholderLoaderState: types.func.isRequired,
};

export default Filters;
