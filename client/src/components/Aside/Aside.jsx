import { useEffect } from "react";
import types from "prop-types";

import CloseSrc from "@/assets/image/close.svg";

import style from "./Aside.module.css";

function Aside({
	id,
	className,
	isOpen,
	isPopup,
	setOpen,
	...props
}) {
	useEffect(() => {
		if (!isOpen || !isPopup) {
			return;
		}

		document.body.style.overflowY = "hidden";
	}, [isOpen]);

	function handleClose() {
		setOpen(false);

		document.body.style.overflowY = "scroll";
	}

	return (
		<aside
			id={id}
			className={`${style.aside} ${isPopup ? style.popup : ""} ${className}`}
			style={{
				display: isOpen ? "unset" : "none",
			}}
		>
			<div className={style.content}>
				{isPopup && (
					<button
						type="button"
						id={style.close}
						className="button"
						onClick={handleClose}
					>
						<img
							src={CloseSrc}
							alt="close"
						/>
					</button>
				)}
				{props.children}
			</div>
			{isPopup && (
				// background for quick exit
				// eslint-disable-next-line max-len
				// eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
				<div
					className={style.background}
					onClick={handleClose}
				/>
			)}
		</aside>
	);
}

Aside.defaultProps = {
	id: "",
	className: "",
	isOpen: true,
	isPopup: false,
	setOpen: null,
};

Aside.propTypes = {
	id: types.string,
	className: types.string,
	isOpen: types.bool,
	setOpen: types.func,
	isPopup: types.bool,
	children: types.node.isRequired,
};

export default Aside;
