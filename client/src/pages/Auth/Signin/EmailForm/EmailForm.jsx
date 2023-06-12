import { useForm, Controller } from "react-hook-form";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import types from "prop-types";

import { asyncActions } from "@/service/redusers/user.js";

import ChannelInput from "@/components/UI/Form/ChannelInput/ChannelInput.jsx";
import Notification from "@/components/UI/Form/Notification/Notification.jsx";
import SimpleLoader from "@/components/UI/SimpleLoader/SimpleLoader.jsx";
import Recaptcha from "@/components/UI/Form/Recaptcha/Recaptcha.jsx";

import style from "@/pages/Auth/Auth.module.css";

function EmailForm({ updatePassword }) {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const {
		control,
		handleSubmit,
		formState: {
			errors,
			isSubmitting,
		},
		setError,
		getFieldState,
	} = useForm({
		mode: "onChange",
	});

	const [[message, status], setMessage] = useState([]);

	const emailState = getFieldState("email");

	const emailError = errors.email?.message;
	const recaptchaError = errors.recaptcha?.message;

	async function onSubmit(data) {
		const res = await dispatch(asyncActions.sendLinkForResetingPassword({
			topic: "resetPassword",
			...data,
		}));

		if (res.payload.error?.length) {
			setError("email", {
				type: "value",
				message: res.payload.error[0].msg.key,
			});
			setMessage([]);
			return;
		}

		if (res.payload.error) {
			setMessage([res.payload.error, "error"]);
			return;
		}

		updatePassword(false);
	}

	function handleCancel() {
		updatePassword(false);
	}

	return (
		<section id={style.auth}>
			<Helmet>
				<title>{t(isSubmitting ? "loading" : "resetPassword")}</title>
			</Helmet>
			<div className="form">
				<div
					className={`loader ${isSubmitting ? "isLoading" : ""}`}
				>
					<SimpleLoader />
				</div>
				<h2 className="title">{t("resetPassword")}</h2>
				<p className="message center">{t("sendPasswordResetEmail")}</p>
				<form onSubmit={handleSubmit(onSubmit)}>
					{message && (
						<Notification
							content={message}
							status={status}
						/>
					)}
					<div>
						<label htmlFor="email">
							<h3 className="title">{t("email")}</h3>
						</label>
						<ChannelInput
							id="email"
							channelName="email"
							control={control}
							onChange={(callback, value) => {
								callback(value);
							}}
							state={[
								["error", emailState.invalid || message],
								["valid", emailState.isDirty && !emailState.invalid],
							]}
							inputRules={{
								required: {
									value: true,
									message: ["requiredemailValid"],
								},
								pattern: {
									value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
									message: ["wrongEmailFormatValid"],
								},
							}}
						/>
						{errors.email && <p className="errorMessage">{t(emailError)}</p>}
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
							type="button"
							className="button border"
							id="cancel"
							onClick={handleCancel}
						>
							{t("cancel")}
						</button>
						<button
							type="submit"
							className="button border"
							id={style.submit}
						>
							{t("submit")}
						</button>
					</div>
				</form>
			</div>
		</section>
	);
}

EmailForm.propTypes = {
	updatePassword: types.func.isRequired,
};

export default EmailForm;
