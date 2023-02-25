export class FilterOptions {
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

		const rez = FilterOptions.byRange([min, max], this.procedures);

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
