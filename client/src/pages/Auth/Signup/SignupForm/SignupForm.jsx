/* eslint-disable react/jsx-props-no-spreading */
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import types from "prop-types";

import axios from "@/http/axios.js";
import format, { keys } from "@/components/UI/Form/ChannelInput/constants/format.js";

import ChannelInput from "@/components/UI/Form/ChannelInput/ChannelInput.jsx";
import BirthSelector from "@/components/UI/Form/BirthSelector/BirthSelector.jsx";
import StateInput from "@/components/UI/Form/StateInput/StateInput.jsx";
import Notification from "@/components/UI/Form/Notification/Notification.jsx";
import SimpleLoader from "@/components/UI/SimpleLoader/SimpleLoader.jsx";

import style from "@/pages/Auth/Auth.module.css";

function SignupForm({ setFormState, user, setUser }) {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { state: locationState } = useLocation();
	const {
		handleSubmit,
		formState: {
			errors,
			isSubmitting,
		},
		setError,
		control,
		getValues,
		getFieldState,
		trigger,
	} = useForm({
		mode: "onChange",
		defaultValues: user,
	});
	const [message, setMessage] = useState(null);

	const usernameState = getFieldState("username");
	const emailState = getFieldState("email");
	const countryState = getFieldState("country");
	const telephoneState = getFieldState("telephone");
	const countryValue = getValues("country");
	const purpose = locationState?.purpose || "adviceForAuth";

	async function onSubmit(data) {
		const isValid = await Promise.allSettled([
			axios.indGet(`/auth/unique/email/${data.email}`),
			axios.indGet(`/auth/unique/username/${data.username}`),
		])
			.then((res) => res.every((object) => {
				if (object.status === "fulfilled") {
					return true;
				}

				if (object.reason.response.status !== 429) {
					setError(object.reason.response.data.args.key, {
						type: "value",
						message: [object.reason.response.data.key],
					});
					setMessage("");

					return false;
				}

				setMessage(object.reason.response.data);

				return false;
			}));

		if (!isValid) {
			return;
		}

		await axios.indPost("/auth/sendPasswordForCompare", data)
			// eslint-disable-next-line no-console
			.catch((res) => console.error(res));

		setUser(data);
		setFormState(true);
	}

	function toSignin() {
		navigate("/signin", {
			state: {
				purpose,
			},
			replace: true,
		});
	}

	function handleCancel() {
		navigate("/appointment");
	}

	const channelInputErrors = {
		lesserTelephoneValid: ["lesserTelephoneValid", {
			max: format.telephone[countryValue || keys[0]].template.length,
		}],
		largerTelephoneValid: ["largerTelephoneValid", {
			min: format.telephone[countryValue || keys[0]].template.length,
		}],
		requiredTelephoneValid: ["requiredTelephoneValid"],
		wrongTelFormatValid: ["wrongTelFormatValid"],
	};

	return (
		<div id={style.auth}>
			<div className="form">
				<div
					id={style.loader}
					className={isSubmitting ? style.isLoading : ""}
				>
					<SimpleLoader />
				</div>
				<h1 className="title">{t("signupAccount")}</h1>
				<p className="message left">{t(purpose)}</p>
				<form onSubmit={handleSubmit(onSubmit)}>
					{message && (
						<Notification
							content={message}
							status="error"
						/>
					)}
					<div>
						<label htmlFor="username">
							<h3 className="title">{t("username")}</h3>
						</label>
						<Controller
							name="username"
							control={control}
							render={({
								field: { onChange },
							}) => (
								<StateInput
									id="username"
									onChange={onChange}
									defaultValue={user.username}
									state={[
										["error", usernameState.invalid],
										["valid", usernameState.isDirty && !usernameState.invalid],
									]}
								/>
							)}
							rules={{
								required: {
									value: !user.username,
									message: ["requiredUsernameValid"],
								},
								pattern: {
									value: /^\p{L}+(?:\s\p{L}+){0,2}$/u,
									message: ["usernameValid"],
								},
								minLength: {
									value: 3,
									message: ["largerUsernameValid", {
										min: 3,
									}],
								},
								maxLength: {
									value: 20,
									message: ["lesserUsernameValid", {
										max: 20,
									}],
								},
							}}
						/>
						{errors.username && <p className="errorMessage">{t(...errors.username.message)}</p>}
					</div>
					<div>
						<label htmlFor="email">
							<h3 className="title">{t("email")}</h3>
						</label>
						<ChannelInput
							id="email"
							channelName="email"
							control={control}
							defaultValue={{
								email: user.email,
							}}
							onChange={(callback, value) => {
								callback(value);
							}}
							state={[
								["error", emailState.invalid],
								["valid", emailState.isDirty && !emailState.invalid],
							]}
							inputRules={{
								required: {
									value: !user.email,
									message: ["requiredEmailValid"],
								},
								pattern: {
									value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
									message: ["wrongEmailFormatValid"],
								},
							}}
						/>
						{errors.email && <p className="errorMessage">{t(...errors.email.message)}</p>}
					</div>
					<div>
						<label htmlFor="telephone">
							<h3 className="title">{t("telephone")}</h3>
						</label>
						<ChannelInput
							channelName="telephone"
							control={control}
							id="telephone"
							className="field"
							defaultValue={{
								country: user.country,
								telephone: user.telephone,
							}}
							onChange={(callback, value) => {
								callback(value);
								trigger("country");
							}}
							maxLength={format.telephone[countryValue]?.template.length}
							inputRules={{
								required: {
									value: !user.telephone,
									message: "requiredTelephoneValid",
								},
								minLength: {
									value: format.telephone[countryValue || keys[0]].template.length,
									message: "lesserTelephoneValid",
								},
								pattern: {
									value: /^[0-9]+$/,
									message: "wrongTelFormatValid",
								},
							}}
							state={[
								["error", telephoneState.invalid || countryState.invalid],
								["valid",
									(telephoneState.isDirty && !telephoneState.invalid)
									|| (countryState.isDirty && !countryState.invalid),
								],
							]}
						/>
						{(errors.telephone || errors.country) && <p className="errorMessage">{t(...channelInputErrors[(errors.telephone || errors.country)?.message])}</p>}
					</div>
					<div>
						<label htmlFor="birthday">
							<h3 className="title">{t("birthday")}</h3>
						</label>
						<Controller
							control={control}
							name="birthday"
							render={({
								field: { onChange },
							}) => (
								<BirthSelector
									id="birthday"
									className="field"
									date={user.birthday}
									onChange={(date) => {
										onChange(date);
									}}
								/>
							)}
							rules={{
								required: {
									value: !user.birthday,
									message: ["requiredBirthdayValid"],
								},
							}}
						/>
						{errors.birthday && <p className="errorMessage">{t(...errors.birthday.message)}</p>}
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
							id={style.signup}
							className="button border"
						>
							{t("signUp")}
						</button>
					</div>
				</form>
				<div className={style.authQueastion}>
					<p>{t("alreadyExistsAccount")}</p>
					<button
						type="button"
						onClick={toSignin}
					>
						{t("signIn")}
					</button>
				</div>
			</div>
		</div>
	);
}

SignupForm.propTypes = {
	setFormState: types.func.isRequired,
	setUser: types.func.isRequired,
	user: types.instanceOf(Object).isRequired,
};

export default SignupForm;
