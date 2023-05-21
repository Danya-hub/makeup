/* eslint-disable react/jsx-props-no-spreading */
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import { useForm, Controller } from "react-hook-form";
import types from "prop-types";

import axios from "@/http/axios.js";

import AvatarCanvas from "@/pages/Auth/helpers/genarateAvatar.js";
import translate from "@/utils/translate.js";

import Notification from "@/components/UI/Form/Notification/Notification.jsx";
import SimpleLoader from "@/components/UI/SimpleLoader/SimpleLoader.jsx";
import PasswordInput from "@/components/UI/Form/PasswordInput/PasswordInput.jsx";
import Recaptcha from "@/components/UI/Form/Recaptcha/Recaptcha.jsx";

import style from "@/pages/Auth/Auth.module.css";

const defaultMessage = () => ([{
	key: "authorizationCodeAsPasswordSignup",
}, "warning"]);

function ConfirmForm({ setFormState, user, onSuccess }) {
	const { t } = useTranslation();
	const {
		handleSubmit,
		formState: {
			errors,
			isSubmitting,
		},
		control,
		clearErrors,
		setError,
		getFieldState,
	} = useForm({
		mode: "onChange",
	});

	const [[message, status], setMessage] = useState(defaultMessage);

	const passwordState = getFieldState("password");

	const passwordError = errors.password?.message;
	const recaptchaError = errors.recaptcha?.message;

	async function onSubmit(data) {
		const result = await axios.indPost("/auth/comparePasswordByEmail", {
			email: user.email,
			password: data.password,
			topic: "compareConfirmationCode",
		})
			.catch((res) => {
				if (res.response.status !== 429) {
					const args = translate.object(res.response.data.error.args, t);

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

		const avatar = AvatarCanvas.getUrl(user.username, 100);

		onSuccess({
			...user,
			password: result.data.password,
			avatar,
		});
	}

	function handleCancel() {
		setFormState(false);
	}

	async function generateNewPassword() {
		await axios.indPost("/auth/sendPasswordForCompare", {
			...user,
			topic: "compareConfirmationCode",
			passwordLength: 8,
		})
			.then(() => {
				setMessage(defaultMessage());
				clearErrors("password");
			})
			// eslint-disable-next-line no-console
			.catch((res) => {
				setMessage([res.response.data.error, "error"]);
			});
	}

	useEffect(() => {
		generateNewPassword();
	}, []);

	return (
		<section id={style.confirm}>
			<Helmet>
				<title>{t(isSubmitting ? "loading" : "confirmAuthorizationCode")}</title>
			</Helmet>
			<div className="form">
				<div
					className={`loader ${isSubmitting ? style.isLoading : ""}`}
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
						<Controller
							name="password"
							control={control}
							rules={{
								required: {
									value: true,
									message: ["authorizationCodeRequiredValid"],
								},
								minLength: {
									value: 8,
									message: ["fullAuthorizationCodeValid", {
										min: 8,
									}],
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
										["error", passwordState.invalid || (message && status === "error")],
										["valid", passwordState.isDirty && !passwordState.invalid],
									]}
								/>
							)}
						/>
						{errors.password && <p className="errorMessage">{t(...passwordError)}</p>}
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
				<div className="authQuestion">
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
		</section>
	);
}

ConfirmForm.propTypes = {
	setFormState: types.func.isRequired,
	user: types.instanceOf(Object).isRequired,
	onSuccess: types.func.isRequired,
};

export default ConfirmForm;
