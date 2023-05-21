import { useEffect, useState, useRef } from "react";
import types from "prop-types";

import ArrowSrc from "@/assets/image/arrow.svg";

import style from "./Details.module.css";

function Details({ id, title, defaultOpen, render }) {
	const [isOpen, setOpenState] = useState(defaultOpen);
	const sublist = useRef(null);

	useEffect(() => {
		sublist.current.classList[isOpen ? "add" : "remove"](style.open);
	}, [isOpen]);

	return (
		<div
			id={id}
			ref={sublist}
			className={`${style.details} ${isOpen ? style.open : ""}`}
		>
			<button
				type="button"
				onClick={() => setOpenState(!isOpen)}
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
	defaultOpen: false,
};

Details.propTypes = {
	id: types.string,
	title: types.string.isRequired,
	render: types.func.isRequired,
	defaultOpen: types.bool,
};

export default Details;
