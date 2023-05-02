import { useState } from "react";

import SigninForm from "./SigninForm/SigninForm.jsx";
import EmailForm from "./EmailForm/EmailForm.jsx";

function Signin() {
	const [passwordIsForgot, updatePassword] = useState(false);

	return passwordIsForgot ? (
		<EmailForm
			updatePassword={updatePassword}
		/>
	) : (
		<SigninForm
			updatePassword={updatePassword}
		/>
	);
}

export default Signin;
