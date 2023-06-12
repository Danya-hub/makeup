import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import types from "prop-types";

function ScrollTo({
	sectionName,
	children,
}) {
	const {
		state: locationState,
		key: updatedKey,
	} = useLocation();
	const componentRef = useRef(null);
	const component = children;

	useEffect(() => {
		if (!componentRef.current) {
			return;
		}

		if (componentRef.current.id === locationState?.section) { //!
			componentRef.current.scrollIntoView();
		}
	}, [updatedKey]);

	return (
		<section
			id={sectionName}
			ref={componentRef}
		>
			{component}
		</section>
	);
}

ScrollTo.propTypes = {
	sectionName: types.string.isRequired,
	children: types.node.isRequired,
};

export default ScrollTo;