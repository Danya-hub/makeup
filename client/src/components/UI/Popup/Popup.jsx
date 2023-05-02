import { useEffect } from "react";
import types from "prop-types";

import CloseSrc from "@/assets/image/close.svg";

import style from "./Popup.module.css";

function Popup({
	id,
	className,
	isSimple,
	isStrictActive,
	strictSwitch,
	onClose,
	styleAttr,
	children,
}) {
	useEffect(() => {
		document.body.style.overflowY = isStrictActive ? "hidden" : "scroll";
	}, [isStrictActive]);

	function handleCloseOnClick() {
		document.body.style.overflowY = "scroll";

		strictSwitch(false);
		onClose();
	}

	return (
		<div
			id={id}
			className={`${style.popup} ${className}`}
			style={{
				...styleAttr,
				display: isStrictActive ? "unset" : "none",
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
			{/* eslint-disable-next-line max-len */}
			{/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
			<div
				className={style.popupBackground}
				style={{
					pointerEvents: isSimple ? "unset" : "none",
				}}
				onClick={isSimple ? handleCloseOnClick : null}
			/>
		</div>
	);
}

Popup.defaultProps = {
	id: "",
	className: "",
	isSimple: true,
	styleAttr: {},
};

Popup.propTypes = {
	id: types.string,
	className: types.string,
	isSimple: types.bool,
	isStrictActive: types.bool.isRequired,
	strictSwitch: types.func.isRequired,
	onClose: types.func.isRequired,
	styleAttr: types.instanceOf(Object),
	children: types.node.isRequired,
};

export default Popup;
