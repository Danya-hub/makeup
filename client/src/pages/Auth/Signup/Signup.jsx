import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Output from "./Output/Output.jsx";
import Confirm from "./Confirm/Confirm.jsx";

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

		navigate(-1);
	}

	return isValidForm ? (
		<Confirm
			formState={[isValidForm, setFormState]}
			userState={[user, setUser]}
			onSuccess={onSuccess}
		/>
	) : (
		<Output
			formState={[isValidForm, setFormState]}
			userState={[user, setUser]}
		/>
	);
}

export default Signup;
