import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import SignupForm from "./SignupForm/SignupForm.jsx";
import ConfirmForm from "./ConfirmForm/ConfirmForm.jsx";

import { asyncActions } from "@/service/redusers/user.js";

function Signup() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [user, setUser] = useState({});
	const [isValidForm, setFormState] = useState(false);

	async function onSuccess(object) {
		const res = await dispatch(asyncActions.signup(object));

		if (res.error) {
			return;
		}

		navigate("/appointment");
	}

	return isValidForm ? (
		<ConfirmForm
			setFormState={setFormState}
			user={user}
			onSuccess={onSuccess}
		/>
	) : (
		<SignupForm
			setFormState={setFormState}
			user={user}
			setUser={setUser}
		/>
	);
}

export default Signup;
