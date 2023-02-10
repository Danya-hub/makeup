import { useState } from "react";

import Output from "./Output/Output.jsx";
import Email from "./Email/Email.jsx";

function Signin() {
	const [user, setUser] = useState({});
	const [isPasswordForgotten, setPasswordForgotten] = useState(false);

	return isPasswordForgotten ? (
		<Email
			passwordState={[isPasswordForgotten, setPasswordForgotten]}
			userState={[user, setUser]}
		></Email>
	) : (
		<Output
			passwordState={[isPasswordForgotten, setPasswordForgotten]}
			userState={[user, setUser]}
		></Output>
	);
}

export { Signin as default };
