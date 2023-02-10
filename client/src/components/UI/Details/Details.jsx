import { useEffect, useState, useRef } from "react";
import types from "prop-types";

import { default as ArrowSrc } from "@/assets/image/arrow.svg";

import style from "./Details.module.css";

Details.propTypes = {
	id: types.string,
	title: types.string,
	children: types.oneOfType([types.object, types.array]),
	isOpen: types.bool,
};

function Details({ id, title, isOpen, ...props }) {
	const [_isOpen, setOpen] = useState(isOpen || false);
	const sublist = useRef(null);

	useEffect(() => {
		sublist.current.classList[_isOpen ? "add" : "remove"](style.open);
	}, [_isOpen]);

	return (
		<div
			id={id}
			ref={sublist}
			className={style.details}
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
			<div className={style.content}>{props.children}</div>
		</div>
	);
}

export { Details as default };
