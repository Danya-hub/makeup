import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Output from "./Output/Output.jsx";
import Confirm from "./Confirm/Confirm.jsx";

import { signup } from "@/service/redusers/user.js";

function Signup() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [user, setUser] = useState({});
	const [isValidForm, setFormState] = useState(false);

	async function onSuccess(_user) {
		const res = await dispatch(signup(_user));

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
		></Confirm>
	) : (
		<Output
			formState={[isValidForm, setFormState]}
			userState={[user, setUser]}
		></Output>
	);
}

export { Signup as default };
