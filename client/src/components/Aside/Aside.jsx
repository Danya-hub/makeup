import { useEffect } from "react";
import types from "prop-types";

import CloseSrc from "@/assets/image/close.svg";

import style from "./Aside.module.css";

function Aside({ id, className, openState, ...props }) {
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
			{openState && (
				// background for quick exit
				// eslint-disable-next-line jsx-a11y/no-static-element-interactions
				<div
					className={style.background}
					onClick={handleClose}
					// onKeyDown={handleClose}
				/>
			)}
		</aside>
	);
}

Aside.defaultProps = {
	id: "",
	className: "",
	openState: null,
};

Aside.propTypes = {
	id: types.string,
	className: types.string,
	openState: types.instanceOf(Array),
	children: types.node.isRequired,
};

export default Aside;
