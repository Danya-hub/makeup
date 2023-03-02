import { useRef, useEffect } from "react";

function useOutsideEvent(callback, eventName = "click") {
	const ref = useRef();

	function handleClick(e) {
		if (ref.current && !ref.current.contains(e.target)) {
			callback();
		}
	}

	useEffect(() => {
		document.body.addEventListener(eventName, handleClick);

		return () => {
			document.body.removeEventListener(eventName, handleClick);
		};
	}, [ref]);

	return ref;
}

export default useOutsideEvent;
