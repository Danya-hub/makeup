import { useState } from "react";

import Output from "./Output/Output.jsx";
import Confirm from "@/pages/Auth/Confirm/Confirm.jsx";

// import { default as GoogleSrc } from "@/assets/image/google.svg";

function Signin() {
	const [isAcceptForm, setFormState] = useState(false);
	const userState = useState({});

	function onSuccess() {
		setFormState(true);
	}

	return isAcceptForm ? (
		<Confirm formState={[isAcceptForm, setFormState]}></Confirm>
	) : (
		<Output
			onSuccess={onSuccess}
			userState={userState}
		></Output>
	);
}

export { Signin as default };
