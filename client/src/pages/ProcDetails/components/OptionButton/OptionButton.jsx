import { useState } from "react";
import types from "prop-types";

import MoreSrc from "@/assets/image/more.svg";
import useOutsideEvent from "@/hooks/useOutsideEvent.js";

import Event from "@/components/Event/Event.jsx";

import style from "./OptionButton.module.css";

function OptionButton({
	render,
}) {
	const [areVisibleOptions, setVisibleOptionsState] = useState(false);

	function handleToggle() {
		setVisibleOptionsState((value) => !value);
	}

	function handleClose() {
		setVisibleOptionsState(false);
	}

	const ref = useOutsideEvent(handleClose);

	return (
		<div
			ref={ref}
			className={style.optionButton}
		>
			<button
				className="button"
				type="button"
				onClick={handleToggle}
			>
				<img
					src={MoreSrc}
					alt="more"
				/>
			</button>
			<div
				className={`${style.options} ${areVisibleOptions ? style.visible : ""}`}
			>
				{render().map((component, i) => (
					<Event
						// eslint-disable-next-line react/no-array-index-key
						key={i}
						callback={handleToggle}
					>
						{component}
					</Event>
				))}
			</div>
		</div>
	);
}

OptionButton.propTypes = {
	render: types.func.isRequired,
};

export default OptionButton;