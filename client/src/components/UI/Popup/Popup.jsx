import { useState, useEffect } from "react";
import types from "prop-types";

import onOutside from "@/hooks/outside.js";
import { default as CloseSrc } from "@/assets/image/close.svg";

import style from "./Popup.module.css";

Popup.propTypes = {
	id: types.string,
	strictSwitch: types.array,
	onOpen: types.func,
	onClose: types.func,
	styleAttr: types.object,
	eventsOnOutside: types.object,
	children: types.oneOfType([types.array, types.object]),
};

function Popup({
	id = "",
	strictSwitch,
	onOpen,
	onClose,
	styleAttr = {},
	eventsOnOutside,
	...props
}) {
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
			{...(eventsOnOutside ? onOutside(eventsOnOutside) : {})}
		>
			<button
				id={style.close}
				className="button"
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