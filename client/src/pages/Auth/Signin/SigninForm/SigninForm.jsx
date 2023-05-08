import { useState, useContext, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import types from "prop-types";

import { asyncActions, actions } from "@/service/redusers/user.js";
import Check from "@/utils/check.js";
import format, { keys } from "@/components/UI/Form/ChannelInput/constants/format.js";
import GlobalContext from "@/context/global.js";

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
		trigger,
	} = useForm({
		mode: "onChange",
	});
	const {
		setAuthState,
	} = useContext(GlobalContext);

	const [channelInputName, setChannelInputName] = useState("email");
	const [[message, status], setMessage] = useState([]);

	const emailState = getFieldState("email");
	const telephoneState = getFieldState("telephone");
	const passwordState = getFieldState("password");
	const countryValue = getValues("country");
	const purpose = state?.purpose || "adviceForAuth";
	const inputRules = useMemo(() => ({
		email: {
			required: {
				value: true,
				message: "requiredemailValid",
			},
			pattern: {
				value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				message: "wrongEmailFormatValid",
			},
		},
		telephone: {
			required: {
				value: true,
				message: "requiredtelephoneValid",
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
	}), [countryValue]);
	const channelInputErrors = useMemo(() => ({
		telephone: {
			requiredtelephoneValid: ["requiredtelephoneValid"],
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
			requiredemailValid: ["requiredemailValid"],
			wrongEmailFormatValid: ["wrongEmailFormatValid"],
			notExistUserValid: ["notExistUserValid"],
		},
	}), [countryValue]);

	const passwordError = errors.password?.message;
	const channelError = channelInputErrors[channelInputName][errors[channelInputName]?.message];

	async function onSubmit(data) {
		const res = await dispatch(asyncActions.signin(data));

		if (res.payload.error?.length) {
			setError(res.payload.error[0].param, {
				type: "value",
				message: res.payload.error[0].msg.key,
			});
			setMessage([]);
			return;
		}

		if (res.payload.error) {
			setMessage(res.payload.error);
			return;
		}

		setAuthState(true);
		navigate("/appointment");
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
		navigate(-1);
	}

	return (
		<div id={style.auth}>
			<div className="form">
				<div
					className={`loader ${isSubmitting ? style.isLoading : ""}`}
				>
					<SimpleLoader />
				</div>
				<h1 className="title">{t("welcome")}</h1>
				<p className="message left">{t(purpose)}</p>
				<form onSubmit={handleSubmit(onSubmit)}>
					{message && (
						<Notification
							content={message}
							status={status}
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
							onSelect={(callback, value) => {
								callback(value);
								trigger();
							}}
							control={control}
							state={[
								["error", emailState.invalid
									|| telephoneState.invalid
									|| message],
								["valid",
									(emailState.isDirty && !emailState.invalid)
									|| (telephoneState.isDirty && !telephoneState.invalid),
								],
							]}
							inputRules={inputRules[channelInputName]}
						/>
						{errors[channelInputName] && <p className="errorMessage">{t(...channelError)}</p>}
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
									maxLength={8}
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
						{errors.password && <p className="errorMessage">{t(passwordError)}</p>}
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
				<div className="authQuestion">
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
