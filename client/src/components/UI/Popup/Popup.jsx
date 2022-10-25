import { useState, useEffect } from "react";
import types from "prop-types";

import { default as CloseSrc } from "@/assets/image/close.svg";

import style from "./Popup.module.css";

Popup.propTypes = {
	id: types.string,
	strictSwitch: types.array,
	onClose: types.func,
	styleAttr: types.object,
	children: types.oneOfType([types.array, types.object]),
};

function Popup({ id = "", strictSwitch, onClose, styleAttr = {}, ...props }) {
	const [isActive, setActive] = strictSwitch || useState(false);

	useEffect(() => {
		if (!isActive) {
			return;
		}

		document.body.style.overflowY = "hidden";
	}, [isActive]);

	function handleClose(e) {
		if (e.currentTarget !== e.target) {
			return;
		}

		setActive(false);
		onClose();

		document.body.style.overflowY = "scroll";
	}

	return (
		<div
			id={id}
			style={{
				...styleAttr,
				display: isActive ? "unset" : "none",
				pointerEvents: !strictSwitch ? "unset" : "none",
			}}
			className={style.popup}
			onClick={!strictSwitch ? handleClose : null}
		>
			<div className="popupContent">
				<button
					id={style.close}
					className="button"
					onClick={handleClose}
				>
					<img
						src={CloseSrc}
						alt="close"
					/>
				</button>
				<div>{props.children}</div>
			</div>
		</div>
	);
}

export { Popup as default };
