import { useEffect } from "react";
import types from "prop-types";

import CloseSrc from "@/assets/image/close.svg";

import style from "./Popup.module.css";

Popup.propTypes = {
	id: types.string,
	isSimple: types.bool,
	strictSwitch: types.array,
	onClose: types.func,
	styleAttr: types.object,
	children: types.oneOfType([types.array, types.object]),
};

function Popup({ id = "", isSimple = true, strictSwitch, onClose, styleAttr = {}, ...props }) {
	const [isActive, setActive] = strictSwitch;

	useEffect(() => {
		document.body.style.overflowY = isActive ? "hidden" : "scroll";
	}, [isActive]);

	function handleClose() {
		setActive(false);
		onClose();
	}

	return (
		<div
			id={id}
			className={style.popup}
			style={{
				...styleAttr,
				display: isActive ? "unset" : "none",
			}}
		>
			<div className={style.popupContent}>
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
			<div
				className={style.popupBackground}
				style={{
					pointerEvents: isSimple ? "unset" : "none",
				}}
				onClick={isSimple ? handleClose : null}
			></div>
		</div>
	);
}

export { Popup as default };
