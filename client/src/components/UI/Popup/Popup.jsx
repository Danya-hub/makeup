import { useEffect } from "react";
import types from "prop-types";

import CloseSrc from "@/assets/image/close.svg";

import style from "./Popup.module.css";

function Popup({ id, isSimple, strictSwitch, onClose, styleAttr, children }) {
	const [isActive, setActive] = strictSwitch;

	useEffect(() => {
		document.body.style.overflowY = isActive ? "hidden" : "scroll";
	}, [isActive]);

	function handleCloseOnClick() {
		setActive(false);
		onClose();
	}

	function handleCloseOnKeyDown(e) {
		console.log(e);

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
					type="button"
					id={style.close}
					className="button"
					onClick={handleCloseOnClick}
				>
					<img
						src={CloseSrc}
						alt="close"
					/>
				</button>
				<div>{children}</div>
			</div>
			{/* background for quick exit */}
			{/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
			<div
				className={style.popupBackground}
				style={{
					pointerEvents: isSimple ? "unset" : "none",
				}}
				onClick={isSimple ? handleCloseOnClick : null}
				onKeyDown={isSimple ? handleCloseOnKeyDown : null}
			/>
		</div>
	);
}

Popup.defaultProps = {
	id: "",
	isSimple: true,
	styleAttr: {},
};

Popup.propTypes = {
	id: types.string,
	isSimple: types.bool,
	strictSwitch: types.instanceOf(Array).isRequired,
	onClose: types.func.isRequired,
	styleAttr: types.instanceOf(Object),
	children: types.node.isRequired,
};

export default Popup;
