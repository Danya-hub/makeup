import { memo } from "react";
import types from "prop-types";

import style from "./Warning.module.css";

function Warning({ text }) {
	return (
		<div className={style.warning}>
			<i
				className="fa fa-exclamation-circle"
				aria-hidden="true"
			/>
			<p>{text}</p>
		</div>
	);
}

Warning.propTypes = {
	text: types.string.isRequired,
};

export default memo(Warning);
