/* eslint-disable react/jsx-props-no-spreading */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import types from "prop-types";

import axios from "@/http/axios.js";

import AvatarCanvas from "@/pages/Auth/helpers/genarateAvatar.js";
import config from "@/pages/Auth/config/auth.js";

import Notification from "@/components/UI/Form/Notification/Notification.jsx";
import SimpleLoader from "@/components/UI/SimpleLoader/SimpleLoader.jsx";

import style from "@/pages/Auth/Auth.module.css";

const defaultMessage = () => ([{
	key: "authorizationCodeAsPasswordSignup",
}, "warning"]);

function ConfirmForm({ setFormState, user, onSuccess }) {
	const { t } = useTranslation();
	const {
		register,
		handleSubmit,
		formState: {
			errors,
			isSubmitting,
		},
		setError,
	} = useForm({
		mode: "onChange",
	});
	const [[message, status], setMessage] = useState(defaultMessage);

	async function onSubmit(data) {
		const result = await axios.indPost("/auth/comparePassword", {
			...user,
			...data,
		})
			.catch((res) => {
				if (res.response.status !== 429) {
					const args = {};

					if (res.response.data.error.args) {
						const keys = Object.keys(res.response.data.error.args);

						keys.forEach((key) => {
							args[key] = t(res.response.data.error.args[key]);
						});
					}

					setError("password", {
						type: "value",
						message: [res.response.data.error.key, args],
					});
					setMessage(defaultMessage());

					return res;
				}

				setMessage([res.response.data.error, "error"]);

				return res;
			});

		if (!result.data) {
			return;
		}

		const avatar = AvatarCanvas.getUrl(result.data.username, 100);

		onSuccess({
			...result.data,
			avatar,
		});
	}

	function handleCancel() {
		setFormState(false);
	}

	async function generateNewPassword() {
		await axios.indPost("/auth/sendPasswordForCompare", user);
	}

	return (
		<div id={style.confirm}>
			<div className="form">
				<div
					id={style.loader}
					className={isSubmitting ? style.isLoading : ""}
				>
					<SimpleLoader />
				</div>
				<h2 className="title">{t("confirmAuthorizationCode")}</h2>
				<p className={`${style.message} ${style.center}`}>
					{t("sendedMessage", {
						email: user.email,
					})}
				</p>
				<Notification
					content={message}
					status={status}
				/>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div>
						<label htmlFor="password">
							<h3 className="title">{t("authorizationCode")}</h3>
						</label>
						<input
							id="password"
							type="text"
							className="input field"
							{...register("password", {
								required: {
									value: true,
									message: ["authorizationCodeRequiredValid"],
								},
								minLength: {
									value: config.MAX_LENGTH_PASSWORD,
									message: ["fullAuthorizationCodecodeValid", {
										min: config.MAX_LENGTH_PASSWORD,
									}],
								},
							})}
							maxLength={config.MAX_LENGTH_PASSWORD}
							autoComplete="off"
						/>
						{errors?.password && <p className="errorMessage">{t(...errors.password.message)}</p>}
					</div>
					<div className="navigation">
						<button
							type="button"
							id={style.back}
							className="button border"
							onClick={handleCancel}
						>
							{t("back")}
						</button>
						<button
							type="submit"
							id={style.submit}
							className="button border"
						>
							{t("submit")}
						</button>
					</div>
				</form>
				<div className={style.authQueastion}>
					<p>{t("forgotPassword")}</p>
					<button
						type="button"
						onClick={(e) => {
							e.preventDefault();

							generateNewPassword();
						}}
					>
						{t("sendMore")}
					</button>
				</div>
			</div>
		</div>
	);
}

ConfirmForm.propTypes = {
	setFormState: types.func.isRequired,
	user: types.instanceOf(Object).isRequired,
	onSuccess: types.func.isRequired,
};

export default ConfirmForm;
