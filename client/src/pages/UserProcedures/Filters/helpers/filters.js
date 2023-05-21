import Check from "@/utils/check.js";

function sortWithCallback(procedures, callback) {
	return procedures.length ? Array(...procedures).sort(callback) : procedures;
}

function minObject(callback, values) {
	if (!values.length) {
		return null;
	}

	const minObj = values.reduce((prevObj, currObj) => {
		const prevVal = callback(prevObj);
		const currVal = callback(currObj);

		return prevVal < currVal ? prevObj : currObj;
	});

	return minObj;
}

function maxObject(callback, values) {
	if (!values.length) {
		return null;
	}

	const maxObj = values.reduce((prevObj, currObj) => {
		const prevVal = callback(prevObj);
		const currVal = callback(currObj);

		return prevVal > currVal ? prevObj : currObj;
	});

	return maxObj;
}

class FilterHelpers {
	static sortOptions = {
		toExpensive: this.toExpensive,
		toCheap: this.toCheap,
	};

	static default = () => ({
		sortBy: null,
		range: [],
		types: {},
	});

	static sortKeys = Object.keys(this.sortOptions);

	constructor(procedures, options) {
		this.procedures = procedures;
		this.options = options;
		this.minSelectedPrice = minObject((obj) => obj.type.price, this.procedures);
		this.maxSelectedPrice = maxObject((obj) => obj.type.price, this.procedures);
	}

	static toExpensive(procedures) {
		const sortedProcs = sortWithCallback(
			procedures,
			(a, b) => (a.type.price < b.type.price ? -1 : 1),
		);

		return sortedProcs;
	}

	static toCheap(procedures) {
		const sortedProcs = sortWithCallback(
			procedures,
			(a, b) => (a.type.price > b.type.price ? -1 : 1),
		);

		return sortedProcs;
	}

	static byRange([min, max], procedures) {
		const rez = procedures.filter((proc) => proc.type.price >= min && proc.type.price <= max);

		return rez;
	}

	changeRangeProcedureOnSelect() {
		const selectedRange = !this.options.range?.length;

		if (selectedRange) {
			return this.procedures;
		}

		const rez = FilterHelpers.byRange(
			this.options.range,
			this.procedures,
		);

		if (!rez.length) {
			return this.procedures;
		}

		this.minSelectedPrice = minObject((obj) => obj.type.price, this.procedures);
		this.maxSelectedPrice = maxObject((obj) => obj.type.price, this.procedures);

		this.procedures = rez;

		return rez;
	}

	changeRangePriceOnGrabbing() {
		const selectedRange = !this.options.range?.length;

		if (!selectedRange) {
			return this.procedures;
		}

		const rez = FilterHelpers.byRange(this.options.range, this.procedures);

		if (!rez.length) {
			return this.procedures;
		}

		this.procedures = rez;

		return rez;
	}

	selectType() {
		const selectedTypes = !Check.isEmptyObject(this.options.types);

		if (selectedTypes) {
			this.procedures = this.procedures.filter((obj) => this.options.types[obj.type.name]);
		}

		return this.procedures;
	}

	sort() {
		if (!this.options.sortBy) {
			return this.procedures;
		}

		this.procedures = FilterHelpers.sortOptions[this.options.sortBy](this.procedures);

		return this.procedures;
	}

	static apply(procedures, options) {
		const filters = new FilterHelpers(procedures, options);

		filters.selectType();
		filters.changeRangeProcedureOnSelect();
		filters.changeRangePriceOnGrabbing();
		filters.sort();

		return filters;
	}
}

export default FilterHelpers;