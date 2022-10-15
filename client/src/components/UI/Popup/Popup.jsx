import { useState, useEffect } from "react";
import types from "prop-types";

import _onOutside from "@/hooks/outside.js";
import { default as CloseSrc } from "@/assets/image/close.svg";

import style from "./Popup.module.css";

Popup.propTypes = {
	id: types.string,
	strictSwitch: types.array,
	onOpen: types.func,
	onClose: types.func,
	styleAttr: types.object,
	onOutside: types.object,
	children: types.array,
};

function Popup({ id = "", strictSwitch, onOpen, onClose, styleAttr = {}, onOutside, ...props }) {
	const [isActive, setActive] = strictSwitch || useState(false);

	useEffect(() => {
		if (isActive && onOpen) {
			onOpen();
		}
	}, [isActive]);

	return (
		<div
			id={id}
			style={{
				...styleAttr,
				display: isActive ? "unset" : "none",
			}}
			className={style.popup}
			{...(onOutside ? _onOutside(onOutside) : {})}
		>
			<button
				id={style.close}
				onClick={() => {
					setActive(false);
					onClose();
				}}
			>
				<img
					src={CloseSrc}
					alt="close"
				/>
			</button>
			<div className={style.popup}>{props.children}</div>
		</div>
	);
}

export { Popup as default };
