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

class FilterActions {
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

	changeRangePriceOnSelect() {
		if (!this.options.range?.length || !this.options.types?.length) {
			return this.procedures;
		}

		this.minSelectedPrice = minObject((obj) => obj.type.price, this.procedures);
		this.maxSelectedPrice = maxObject((obj) => obj.type.price, this.procedures);

		const rez = FilterActions.byRange(
			[this.minSelectedPrice.type.price, this.maxSelectedPrice.type.price],
			this.procedures,
		);

		if (!rez.length) {
			return this.procedures;
		}

		this.procedures = rez;

		return rez;
	}

	changeRangePriceOnGrabbing() {
		if (!this.options.range?.length) {
			return this.procedures;
		}

		const [min, max] = this.options.range;

		const rez = FilterActions.byRange([min, max], this.procedures);

		if (!rez.length) {
			return this.procedures;
		}

		this.procedures = rez;

		return rez;
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

		return rez;
	}

	sort() {
		if (!this.options.sortBy) {
			return this.procedures;
		}

		this.procedures = FilterActions.sortOptions[this.options.sortBy](this.procedures);

		return this.procedures;
	}

	static apply(procedures, options) {
		const filters = new FilterActions(procedures, options);

		filters.selectType();
		filters.changeRangePriceOnSelect();
		filters.changeRangePriceOnGrabbing();
		filters.sort();

		return filters;
	}
}

export default FilterActions;
