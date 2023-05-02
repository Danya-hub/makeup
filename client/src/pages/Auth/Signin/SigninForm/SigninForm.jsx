import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import types from "prop-types";

import { asyncActions, actions } from "@/service/redusers/user.js";
import Check from "@/utils/check.js";
import format, { keys } from "@/components/UI/Form/ChannelInput/constants/format.js";

import ChannelInput from "@/components/UI/Form/ChannelInput/ChannelInput.jsx";
import PasswordInput from "@/components/UI/Form/PasswordInput/PasswordInput.jsx";
import Notification from "@/components/UI/Form/Notification/Notification.jsx";
import SimpleLoader from "@/components/UI/SimpleLoader/SimpleLoader.jsx";

import style from "@/pages/Auth/Auth.module.css";

function SigninForm({
	updatePassword,
}) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { state } = useLocation();
	const {
		handleSubmit,
		formState: {
			errors,
			isSubmitting,
		},
		unregister,
		getValues,
		setError,
		getFieldState,
		control,
	} = useForm({
		mode: "onChange",
	});

	const [channelInputName, setChannelInputName] = useState("email");
	const [message, setMessage] = useState(null);

	const emailState = getFieldState("email");
	const telephoneState = getFieldState("telephone");
	const countryState = getFieldState("country");
	const passwordState = getFieldState("password");
	const countryValue = getValues("country");
	const purpose = state?.purpose || "adviceForAuth";
	const inputRules = {
		email: {
			required: {
				value: true,
				message: "requiredEmailValid",
			},
			pattern: {
				value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				message: "wrongEmailFormatValid",
			},
		},
		telephone: {
			required: {
				value: true,
				message: "requiredTelephoneValid",
			},
			minLength: {
				value: format.telephone[countryValue || keys[0]].template.length,
				message: "lesserTelephoneValid",
			},
			maxLength: {
				value: format.telephone[countryValue || keys[0]].template.length,
				message: "largerTelephoneValid",
			},
			pattern: {
				value: /^[0-9]+$/,
				message: "wrongTelFormatValid",
			},
		},
	};
	const channelInputErrors = {
		telephone: {
			requiredTelephoneValid: ["requiredTelephoneValid"],
			lesserTelephoneValid: ["lesserTelephoneValid", {
				max: format.telephone[countryValue || keys[0]].template.length,
			}],
			largerTelephoneValid: ["largerTelephoneValid", {
				min: format.telephone[countryValue || keys[0]].template.length,
			}],
			wrongTelFormatValid: ["wrongTelFormatValid"],
			notExistUserValid: ["notExistUserValid"],
		},
		email: {
			requiredEmailValid: ["requiredEmailValid"],
			wrongEmailFormatValid: ["wrongEmailFormatValid"],
			notExistUserValid: ["notExistUserValid"],
		},
	};

	async function onSubmit(data) {
		const res = await dispatch(asyncActions.signin(data));

		if (res.payload.error?.length) {
			setError(channelInputName, {
				type: "value",
				message: res.payload.error[0].msg.key,
			});
			return;
		}

		if (res.payload.error) {
			setMessage(res.payload.error);
			return;
		}

		console.log('1');

		// navigate(-1);
	}

	function toSignup() {
		dispatch(actions.clearError());

		navigate("/signup", {
			state: {
				purpose,
			},
			replace: true,
		});
	}

	function handleResetPassword() {
		dispatch(actions.clearError());

		updatePassword(true);
	}

	function handleCancel() {
		navigate("/appointment");
	}

	return (
		<div id={style.auth}>
			<div className="form">
				<div
					id={style.loader}
					className={isSubmitting ? style.isLoading : ""}
				>
					<SimpleLoader />
				</div>
				<h1 className="title">{t("welcome")}</h1>
				<p className="message left">{t(purpose)}</p>
				<form onSubmit={handleSubmit(onSubmit)}>
					{message && (
						<Notification
							content={message}
							status="error"
						/>
					)}
					<div>
						<label htmlFor="channel">
							<h3 className="title">{`${t("email")} / ${t("telephone")}`}</h3>
						</label>
						<ChannelInput
							id="channel"
							channelName={channelInputName}
							onChange={(callback, value) => {
								const channelName = Check.isStrictNumber(value) ? "telephone" : "email";

								if (channelName !== channelInputName) {
									unregister(channelInputName);
								} else {
									callback(value);
								}

								setChannelInputName(channelName);
							}}
							control={control}
							state={[
								["error", emailState.invalid
									|| telephoneState.invalid
									|| countryState.invalid
									|| message],
								["valid",
									(emailState.isDirty && !emailState.invalid)
									|| (telephoneState.isDirty && !telephoneState.invalid)
									|| (countryState.isDirty && !countryState.invalid),
								],
							]}
							inputRules={inputRules[channelInputName]}
						/>
						{errors[channelInputName] && <p className="errorMessage">{t(...channelInputErrors[channelInputName][errors[channelInputName]?.message])}</p>}
					</div>
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
									message: ["requiredPasswordValid"],
								},
							}}
							render={({
								field: { onChange },
							}) => (
								<PasswordInput
									id="password"
									name="password"
									className="field input"
									onChange={(e) => onChange(e.currentTarget.value)}
									state={[
										["error", passwordState.invalid || message],
										["valid", passwordState.isDirty && !passwordState.invalid],
									]}
								/>
							)}
						/>
						{errors.password && <p className="errorMessage">{t(...errors.password.message)}</p>}
					</div>
					<div className={style.forgotPassword}>
						<p>{t("forgotPassword")}</p>
						<button
							type="button"
							onClick={handleResetPassword}
						>
							{t("sendToEmail")}
						</button>
					</div>
					<div className="navigation">
						<button
							type="button"
							id={style.cancel}
							className="button border"
							onClick={handleCancel}
						>
							{t("cancel")}
						</button>
						<button
							type="submit"
							id={style.signin}
							className="button border"
						>
							{t("signIn")}
						</button>
					</div>
				</form>
				<div className={style.authQueastion}>
					<p>{t("notHaveAccount")}</p>
					<button
						type="button"
						onClick={toSignup}
					>
						{t("signUp")}
					</button>
				</div>
			</div>
		</div>
	);
}

SigninForm.propTypes = {
	updatePassword: types.func.isRequired,
};

export default SigninForm;
