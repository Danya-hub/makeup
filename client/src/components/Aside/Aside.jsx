import { Fragment, useEffect } from "react";
import types from "prop-types";

import CloseSrc from "@/assets/image/close.svg";

import style from "./Aside.module.css";

Aside.propTypes = {
	id: types.string,
	className: types.string,
	openState: types.array,
	onClose: types.func,
	children: types.oneOfType([types.array, types.object]),
};

function Aside({ id = "", className = "", openState, ...props }) {
	const [isOpen = true, setState] = openState || [];

	useEffect(() => {
		if (!isOpen || !openState) {
			return;
		}

		document.body.style.overflowY = "hidden";
	}, [isOpen]);

	function handleClose() {
		setState(false);

		document.body.style.overflowY = "scroll";
	}

	return (
		<aside
			id={id}
			className={`${style.aside} ${openState ? style.popup : ""} ${className}`}
			style={{
				display: isOpen ? "unset" : "none",
			}}
		>
			<div className={style.content}>
				{openState && (
					<Fragment>
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
					</Fragment>
				)}
				{props.children}
			</div>
			{openState && (
				<div
					className={style.background}
					onClick={handleClose}
				></div>
			)}
		</aside>
	);
}

export { Aside as default };
