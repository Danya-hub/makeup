import { useState, useEffect, useRef } from "react";
import types from "prop-types";

import style from "./Sublist.module.css";
import ArrowSrc from "@/assets/image/arrow.svg";

Sublist.propTypes = {
	id: types.string,
	title: types.string,
	values: types.arrayOf(types.object),
	isOpen: types.bool,
	children: types.func,
};

function Sublist({ id = "", title, values, isOpen, ...props }) {
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
			<div
				onClick={() => setOpen(!_isOpen)}
				className={style.title}
			>
				<h3>{title}</h3>
				<img
					className={style.arrow}
					src={ArrowSrc}
					alt="arrow"
				/>
			</div>
			<ul className={style.list}>
				{values.map((value, index) => (
					<li key={value + "/" + index}>{props.children(value)}</li>
				))}
			</ul>
		</div>
	);
}

export { Sublist as default };
