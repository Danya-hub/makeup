import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import types from "prop-types";

function ScrollTo({
	sectionName,
	children,
}) {
	const params = useParams();
	const componentRef = useRef(null);

	const component = children;

	useEffect(() => {
		if (!componentRef.current) {
			return;
		}

		if (componentRef.current.id === params.section) {
			componentRef.current.scrollIntoView();
		}
	}, [componentRef.current, params.section]);

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