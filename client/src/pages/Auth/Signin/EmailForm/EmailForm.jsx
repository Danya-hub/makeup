import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import types from "prop-types";

import { asyncActions } from "@/service/redusers/user.js";

import ChannelInput from "@/components/UI/Form/ChannelInput/ChannelInput.jsx";
import Notification from "@/components/UI/Form/Notification/Notification.jsx";
import SimpleLoader from "@/components/UI/SimpleLoader/SimpleLoader.jsx";

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

	const [message, setMessage] = useState(null);
	const emailState = getFieldState("email");

	async function onSubmit(data) {
		const res = await dispatch(asyncActions.sendLinkForResetingPassword(data));

		if (res.payload.error?.length) {
			setError("email", {
				type: "value",
				message: res.payload.error[0].msg.key,
			});
			return;
		}

		if (res.payload.error) {
			setMessage(res.payload.error);
			return;
		}

		updatePassword(false);
	}

	function handleCancel() {
		updatePassword(false);
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
				<h2 className="title">{t("resetPassword")}</h2>
				<p className="message center">{t("sendPasswordResetEmail")}</p>
				<form onSubmit={handleSubmit(onSubmit)}>
					{message && (
						<Notification
							content={message}
							status="error"
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
									message: ["requiredEmailValid"],
								},
								pattern: {
									value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
									message: ["wrongEmailFormatValid"],
								},
							}}
						/>
						{errors.email && <p className="errorMessage">{t(errors.email.message)}</p>}
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
		</div>
	);
}

EmailForm.propTypes = {
	updatePassword: types.func.isRequired,
};

export default EmailForm;
