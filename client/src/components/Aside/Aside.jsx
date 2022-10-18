import { Fragment } from "react";
import types from "prop-types";

import { default as CloseSrc } from "@/assets/image/close.svg";

import style from "./Aside.module.css";

Aside.propTypes = {
	id: types.string,
	openState: types.array,
	onClose: types.func,
	children: types.oneOfType([types.array, types.object]),
};

function Aside({ id = "", openState, ...props }) {
	const [isOpen = true, setState] = openState || [];

	function handleClose() {
		setState(false);
	}

	return (
		<aside
			id={id}
			className={`${style.aside} ${openState ? style.popup : ""}`}
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
			<div
				className={style.background}
				onClick={handleClose}
			></div>
		</aside>
	);
}

export { Aside as default };
