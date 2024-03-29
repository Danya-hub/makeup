import { memo } from "react";
import types from "prop-types";

function Event({ callback, eventName, children }) {
	const childProps = {
		...children.props,
		[`on${eventName}`]: () => {
			if (children.props[`on${eventName}`]) {
				children.props[`on${eventName}`]();
			}

			callback();
		},
	};
	const component = {
		...children,
		props: childProps,
	};

	return component;
}

Event.defaultProps = {
	eventName: "Click",
};

Event.propTypes = {
	children: types.node.isRequired,
	callback: types.func.isRequired,
	eventName: types.string,
};

export default memo(Event);
