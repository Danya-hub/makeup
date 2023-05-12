import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";

import Notification from "@/components/UI/Form/Notification/Notification.jsx";
import PasswordInput from "@/components/UI/Form/PasswordInput/PasswordInput.jsx";
import SimpleLoader from "@/components/UI/SimpleLoader/SimpleLoader.jsx";
import Recaptcha from "@/components/UI/Form/Recaptcha/Recaptcha.jsx";

import { asyncActions } from "@/service/redusers/user.js";
import translate from "@/utils/translate.js";

import style from "@/pages/Auth/Auth.module.css";

function ResetPassword() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const {
		handleSubmit,
		control,
		setError,
		formState: {
			errors,
			isSubmitting,
		},
		getFieldState,
	} = useForm({
		mode: "onSubmit",
	});

	const [searchParams] = useSearchParams();
	const email = searchParams.get("email");
	const [[message, status], setMessage] = useState([]);

	const passwordState = getFieldState("password");
	const confirmedPasswordState = getFieldState("confirmedPassword");

	const passwordErrors = useRef({
		requiredPasswordValid: ["requiredPasswordValid"],
		requiredConfirmationPasswordValid: ["requiredConfirmationPasswordValid"],
		largerPasswordValid: ["largerPasswordValid", {
			min: 8,
		}],
		passwordsNotSameValid: ["passwordsNotSameValid"],
	});

	const recaptchaError = errors.recaptcha?.message;
	const passwordError = passwordErrors.current[errors.password?.message];
	const confirmedPasswordError = passwordErrors.current[errors.confirmedPassword?.message];

	async function onSubmit(data) {
		const resultResetPassword = await dispatch(
			asyncActions.resetPassword({
				email,
				newPassword: data.password,
			}),
		);

		if (resultResetPassword.error) {
			const args = translate.object(resultResetPassword.payload.error.args, t);

			setMessage({
				key: resultResetPassword.payload.error.key,
				args,
			});
			return;
		}

		navigate("/appointment");
	}

	async function sendAgain() {
		const res = await dispatch(asyncActions.sendLinkForResetingPassword({
			email,
		}));

		if (res.payload.error?.length) {
			setError("email", {
				type: "value",
				message: res.payload.error[0].msg.key,
			});
			return;
		}

		if (res.payload.error) {
			setMessage([res.payload.error, "error"]);
		}
	}

	function handleMain() {
		navigate("/");
	}

	return (
		<div id={style.auth}>
			<div className="form">
				<div
					className={`loader ${isSubmitting ? style.isLoading : ""}`}
				>
					<SimpleLoader />
				</div>
				<h2 className="title">{t("changePassword")}</h2>
				<p className="message center">{t("enterPasswordAndConfirmIt")}</p>
				<form onSubmit={handleSubmit(onSubmit)}>
					{message && (
						<Notification
							content={message}
							status={status}
						/>
					)}
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
									value: 8,
									message: "largerPasswordValid",
								},
							}}
							render={({
								field: { onChange },
							}) => (
								<PasswordInput
									maxLength={8}
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
						{errors.password && <p className="errorMessage">{t(...passwordError)}</p>}
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
									value: 8,
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
									maxLength={8}
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
						{errors.confirmedPassword && <p className="errorMessage">{t(...confirmedPasswordError)}</p>}
					</div>
					<div>
						<Controller
							name="recaptcha"
							control={control}
							rules={{
								required: {
									value: true,
									message: "requiredRecaptchaValid",
								},
							}}
							render={({
								field: { onChange },
							}) => (
								<Recaptcha
									onChange={onChange}
								/>
							)}
						/>
						{errors.recaptcha && <p className="errorMessage">{t(recaptchaError)}</p>}
					</div>
					<div className="navigation">
						<button
							id="toMain"
							className="button border"
							type="button"
							onClick={handleMain}
						>
							{t("toMain")}
						</button>
						<button
							type="submit"
							className="button border"
						>
							{t("change")}
						</button>
					</div>
					<div className="authQuestion">
						<p>{t("timeOutQuestion")}</p>
						<button
							type="button"
							onClick={(e) => {
								e.preventDefault();

								sendAgain();
							}}
						>
							{t("sendMore")}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default ResetPassword;
