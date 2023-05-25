import { memo } from "react";
import types from "prop-types";

import style from "./DesignButton.module.css";

function DesignButton({
	pulseAnimation,
	countProcedures,
	pointStyles,
	onClick,
	text,
}) {
	return (
		<button
			type="button"
			className={`button border ${style.button}`}
			onClick={onClick}
		>
			<span
				className={style.point}
				style={{
					...pointStyles,
					animation: pulseAnimation ? `2s ease-in ${style.pulse} infinite` : "",
				}}
			>
				{countProcedures}
			</span>
			{text}
		</button>
	);
}

DesignButton.defaultProps = {
	pulseAnimation: false,
};

DesignButton.propTypes = {
	pulseAnimation: types.bool,
	countProcedures: types.number.isRequired,
	pointStyles: types.instanceOf(Object).isRequired,
	onClick: types.func.isRequired,
	text: types.string.isRequired,
};

export default memo(DesignButton);