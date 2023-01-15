import { Fragment, memo } from "react";
import types from "prop-types";

Event.propTypes = {
	children: types.object,
	callback: types.func,
	eventName: types.string,
};

function Event({ callback, eventName = "Click", ...props }) {
	const _props = props.children.props;
	const childProps = {
		..._props,
		[`on${eventName}`]: () => {
			_props[`on${eventName}`]();
			callback();
		},
	};
	const childElem = {
		...props.children,
		props: childProps,
	};

	return <Fragment>{childElem}</Fragment>;
}

export default memo(Event);
