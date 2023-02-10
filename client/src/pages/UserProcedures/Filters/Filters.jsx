import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import Value from "@/helpers/value.js";

import Aside from "@/components/Aside/Aside.jsx";
import Select from "@/components/UI/Form/Select/Select.jsx";
import Range from "@/components/UI/Form/Range/Range.jsx";
import Details from "@/components/UI/Details/Details.jsx";
import Search from "@/components/UI/Form/Search/Search.jsx";

import style from "./Filters.module.css";

class FilterOptions {
	static sortOptions = {
		toExpensive: this.toExpensive,
		toCheap: this.toCheap,
	};

	static default = () => ({
		sortBy: null,
		range: null,
		types: null,
	});

	static sortKeys = Object.keys(this.sortOptions);

	constructor(procedures, options) {
		this.procedures = procedures;
		this.options = options;
		this.minSelectedPrice = Math.minObject((obj) => obj.type.price, this.procedures);
		this.maxSelectedPrice = Math.maxObject((obj) => obj.type.price, this.procedures);
	}

	static toExpensive(procedures) {
		const sortedProcs = procedures.sortWithCallback((a, b) =>
			a.type.price < b.type.price ? -1 : 1
		);

		return sortedProcs;
	}

	static toCheap(procedures) {
		const sortedProcs = procedures.sortWithCallback((a, b) =>
			a.type.price > b.type.price ? -1 : 1
		);

		return sortedProcs;
	}

	static byRange([min, max], procedures) {
		const rez = procedures.filter((proc) => proc.type.price >= min && proc.type.price <= max);

		return rez;
	}

	changeRangePriceOnSelect() {
		if (!this.options.range?.length || !this.options.types?.length) {
			return this.procedures;
		}
		
		this.minSelectedPrice = Math.minObject((obj) => obj.type.price, this.procedures);
		this.maxSelectedPrice = Math.maxObject((obj) => obj.type.price, this.procedures);

		const rez = FilterOptions.byRange(
			[this.minSelectedPrice.type.price, this.maxSelectedPrice.type.price],
			this.procedures
		);

		if (!rez.length) {
			return this.procedures;
		}

		this.procedures = rez;
	}

	changeRangePriceOnGrabbing() {
		if (!this.options.range?.length) {
			return this.procedures;
		}

		const [min, max] = this.options.range;

		const rez = FilterOptions.byRange(
			[min, max],
			this.procedures
		);

		if (!rez.length) {
			return this.procedures;
		}

		this.procedures = rez;
	}

	selectType() {
		if (!this.options.types?.length) {
			return this.procedures;
		}

		let rez = this.procedures;
		if (this.options.types.length) {
			rez = this.procedures.filter((obj) => this.options.types.includes(obj.type.name));
		}

		this.procedures = rez;
	}

	sort() {
		if (!this.options.sortBy) {
			return this.procedures;
		}

		this.procedures = FilterOptions.sortOptions[this.options.sortBy](this.procedures);
	}

	static apply() {
		const filters = new FilterOptions(...arguments);

		filters.selectType();
		filters.changeRangePriceOnSelect();
		filters.changeRangePriceOnGrabbing();
		filters.sort();

		return filters;
	}
}

Filters.propTypes = {
	tempCardsState: types.array,
	initialCards: types.array,
};

function Filters({ tempCardsState, initialCards }) {
	const { t } = useTranslation();

	const [selectedOptions, setOption] = useState(FilterOptions.default());
	const [[minPrice, maxPrice], setRangePrice] = useState([]);

	const [tempCards, setTempCard] = tempCardsState;
	const translatedOption = FilterOptions.sortKeys.map(t);
	const typeProcNames = useMemo(() => tempCards
		.map((proc) => proc.type.name)
		.filter((type, i, arr) => !arr.slice(0, i).includes(type)), [selectedOptions.range]);

	function handleReset() {
		setOption(FilterOptions.default());
	}

	function handleSearch(typeName) {
		const _typeName = typeName.toLowerCase();
		const foundProcs = initialCards.filter((proc) => proc.type.name.toLowerCase().includes(_typeName));

		setTempCard(foundProcs);
	}

	useEffect(() => {
		if (!initialCards.length) {
			return;
		}

		const filters = FilterOptions.apply(initialCards, selectedOptions);

		setRangePrice([filters.minSelectedPrice, filters.maxSelectedPrice]);
		setTempCard(filters.procedures);
	}, [
		selectedOptions.range,
		selectedOptions.sortBy,
		selectedOptions.types,
	]);

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
						const {
							min,
							max,
						} = _options;

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
