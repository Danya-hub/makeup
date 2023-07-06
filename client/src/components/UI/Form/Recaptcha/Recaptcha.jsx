import { useRef, useContext } from "react";
import Component from "react-google-recaptcha";
import types from "prop-types";

import GlobalContext from "@/context/global.js";

function Recaptcha({
	onChange,
}) {
	const {
		currentLang,
	} = useContext(GlobalContext);

	const captchaRef = useRef(null);

	return (
		<Component
			ref={captchaRef}
			sitekey={process.env.SITE_KEY}
			onChange={() => onChange(captchaRef.current.getValue())}
			hl={currentLang}
		/>
	);
}

Recaptcha.propTypes = {
	onChange: types.func.isRequired,
};

export default Recaptcha;