import { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import { asyncActions } from "@/service/redusers/user.js";
import config from "@/pages/Auth/config/auth.js";

import Notification from "@/components/UI/Form/Notification/Notification.jsx";
import PasswordInput from "@/components/UI/Form/PasswordInput/PasswordInput.jsx";

import style from "@/pages/Auth/Auth.module.css";

function ResetPassword() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const params = useParams();
	const {
		handleSubmit,
		control,
		formState: {
			errors,
		},
		getFieldState,
	} = useForm({
		mode: "onSubmit",
	});

	const [message, setMessage] = useState(null);

	const passwordState = getFieldState("password");
	const confirmedPasswordState = getFieldState("confirmedPassword");

	const passwordErrors = {
		requiredPasswordValid: ["requiredPasswordValid"],
		requiredConfirmationPasswordValid: ["requiredConfirmationPasswordValid"],
		largerPasswordValid: ["largerPasswordValid", {
			min: config.MAX_LENGTH_PASSWORD,
		}],
		passwordsNotSameValid: ["passwordsNotSameValid"],
	};

	async function handleSubmitForm(data) {
		const res = await dispatch(
			asyncActions.resetPassword({
				email: params.email,
				newPassword: data.password,
			}),
		);

		if (res.error) {
			const args = {};

			if (res.payload.error.args) { //! идентичный код с confirmForm
				const keys = Object.keys(res.payload.error.args);

				keys.forEach((key) => {
					args[key] = t(res.payload.error.args[key]);
				});
			}

			setMessage({
				key: res.payload.error.key,
				args,
			});
			return;
		}

		console.log('1');

		// navigate("/appointment");
	}

	function handleCancel() {
		navigate(-1);
	}

	return (
		<div id={style.auth}>
			<div className="form">
				<h2 className="title">{t("changePassword")}</h2>
				<p className="message center">{t("enterPasswordAndConfirmIt")}</p>
				{message && (
					<Notification
						content={message}
						status="error"
					/>
				)}
				<form onSubmit={handleSubmit(handleSubmitForm)}>
					<div>
						<label htmlFor="password">
							<h3 className="title">{t("password")}</h3>
						</label>
						<Controller
							name="password"
							control={control}
							rules={{
								required: {
									value: true,
									message: "requiredPasswordValid",
								},
								minLength: {
									value: config.MAX_LENGTH_PASSWORD,
									message: "largerPasswordValid",
								},
							}}
							render={({
								field: { onChange },
							}) => (
								<PasswordInput
									hasSwitch={false}
									name="password"
									className="input field"
									onChange={(e) => onChange(e.currentTarget.value)}
									state={[
										["error", passwordState.invalid || message],
										["valid", passwordState.isDirty && !passwordState.invalid],
									]}
								/>
							)}
						/>
						{errors.password && <p className="errorMessage">{t(...passwordErrors[errors.password.message])}</p>}
					</div>
					<div>
						<label htmlFor="confirmedPassword">
							<h3 className="title">{t("confirmPassword")}</h3>
						</label>
						<Controller
							name="confirmedPassword"
							control={control}
							rules={{
								required: {
									value: true,
									message: "requiredConfirmationPasswordValid",
								},
								minLength: {
									value: config.MAX_LENGTH_PASSWORD,
									message: "largerPasswordValid",
								},
								validate: (value, formValues) => {
									if (value !== formValues.password) {
										return "passwordsNotSameValid";
									}

									return true;
								},
							}}
							render={({
								field: { onChange },
							}) => (
								<PasswordInput
									hasSwitch={false}
									name="confirmedPassword"
									className="input field"
									onChange={(e) => onChange(e.currentTarget.value)}
									state={[
										["error", passwordState.invalid
											|| confirmedPasswordState.invalid
											|| message],
										["valid", (passwordState.isDirty && !passwordState.invalid)
											|| (confirmedPasswordState.isDirty && !confirmedPasswordState.invalid)],
									]}
								/>
							)}
						/>
						{errors.confirmedPassword && <p className="errorMessage">{t(...passwordErrors[errors.confirmedPassword.message])}</p>}
					</div>
					<div className="navigation">
						<button
							type="button"
							className="button border"
							onClick={handleCancel}
						>
							{t("cancel")}
						</button>
						<button
							type="submit"
							className="button border"
						>
							{t("change")}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default ResetPassword;
