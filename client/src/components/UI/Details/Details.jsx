import { useEffect, useState, useRef } from "react";
import types from "prop-types";

import ArrowSrc from "@/assets/image/arrow.svg";

import style from "./Details.module.css";

function Details({ id, title, isOpen, render }) {
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
			<button
				type="button"
				onClick={() => setOpen(!_isOpen)}
				className={style.title}
			>
				{title}
				<img
					className={style.arrow}
					src={ArrowSrc}
					alt="arrow"
				/>
			</button>
			<div className={style.content}>{render()}</div>
		</div>
	);
}

Details.defaultProps = {
	id: "",
};

Details.propTypes = {
	id: types.string,
	title: types.string.isRequired,
	render: types.func.isRequired,
	isOpen: types.bool.isRequired,
};

export default Details;
