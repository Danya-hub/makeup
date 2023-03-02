import { useState, useEffect, useRef } from "react";
import types from "prop-types";

import style from "./Sublist.module.css";
import ArrowSrc from "@/assets/image/arrow.svg";

function Sublist({ id, title, values, isOpen, ...props }) {
	const [_isOpen, setOpen] = useState(isOpen || false);
	const sublist = useRef(null);

	useEffect(() => {
		sublist.current.classList[_isOpen ? "add" : "remove"](style.open);
	}, [_isOpen]);

	return (
		<div
			ref={sublist}
			className={style.sublist}
			id={id}
		>
			<button
				type="button"
				onClick={() => setOpen(!_isOpen)}
				className={style.title}
			>
				<h3>{title}</h3>
				<img
					className={style.arrow}
					src={ArrowSrc}
					alt="arrow"
				/>
			</button>
			<ul className={style.list}>
				{values.map((value) => (
					<li key={value}>{props.children(value)}</li>
				))}
			</ul>
		</div>
	);
}

Sublist.defaultProps = {
	id: "",
};

Sublist.propTypes = {
	id: types.string,
	title: types.string.isRequired,
	values: types.instanceOf(Array).isRequired,
	isOpen: types.bool.isRequired,
	children: types.func.isRequired,
};

export default Sublist;
