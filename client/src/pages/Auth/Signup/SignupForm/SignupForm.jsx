/* eslint-disable react/jsx-props-no-spreading */
import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
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
import Recaptcha from "@/components/UI/Form/Recaptcha/Recaptcha.jsx";

import style from "@/pages/Auth/Auth.module.css";

function SignupForm({ setFormState, user, setUser }) {
	const { t } = useTranslation();
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

	const [[message, status], setMessage] = useState([]);

	const usernameState = getFieldState("username");
	const emailState = getFieldState("email");
	const telephoneState = getFieldState("telephone");
	const countryValue = getValues("country");

	const channelInputErrors = useMemo(() => ({
		lesserTelephoneValid: ["lesserTelephoneValid", {
			max: format.telephone[countryValue || keys[0]].template.length,
		}],
		largerTelephoneValid: ["largerTelephoneValid", {
			min: format.telephone[countryValue || keys[0]].template.length,
		}],
		requiredtelephoneValid: ["requiredtelephoneValid"],
		wrongTelFormatValid: ["wrongTelFormatValid"],
	}), [countryValue]);

	const purpose = locationState?.purpose || "adviceForAuth";
	const usernameError = errors.username?.message;
	const emailError = errors.email?.message;
	const telephoneError = channelInputErrors[(errors.telephone || errors.country)?.message];
	const birthdayError = errors.birthday?.message;
	const recaptchaError = errors.recaptcha?.message;

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
					setError(object.reason.response.data.error.name, {
						type: "value",
						message: [object.reason.response.data.error.key],
					});
					setMessage([]);

					return false;
				}

				setMessage([object.reason.response.data, "error"]);

				return false;
			}));

		if (!isValid) {
			return;
		}

		const {
			recaptcha,
			...result
		} = data;

		setUser(result);
		setFormState(true);
	}

	return (
		<section id={style.auth}>
			<Helmet>
				<title>{t(isSubmitting ? "loading" : "signUpTitle")}</title>
			</Helmet>
			<div className="form">
				<div
					className={`loader ${isSubmitting ? "isLoading" : ""}`}
				>
					<SimpleLoader />
				</div>
				<h1 className="title">{t("signupAccount")}</h1>
				<p className="message left">{t(purpose)}</p>
				<form onSubmit={handleSubmit(onSubmit)}>
					{message && (
						<Notification
							content={message}
							status={status}
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
									message: ["requiredusernameValid"],
								},
								pattern: {
									value: /^\p{L}+(?:\s\p{L}+)?$/u,
									message: ["usernameValid"],
								},
								minLength: {
									value: 3,
									message: ["largerusernameValid", {
										min: 3,
									}],
								},
								maxLength: {
									value: 40,
									message: ["lesserUsernameValid", {
										max: 40,
									}],
								},
							}}
						/>
						{errors.username && <p className="errorMessage">{t(...usernameError)}</p>}
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
									message: ["requiredemailValid"],
								},
								pattern: {
									value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
									message: ["wrongEmailFormatValid"],
								},
							}}
						/>
						{errors.email && <p className="errorMessage">{t(...emailError)}</p>}
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
							onSelect={(callback, value) => {
								callback(value);
								trigger();
							}}
							onChange={(callback, value) => {
								callback(value);
								trigger("country");
							}}
							maxLength={format.telephone[countryValue]?.template.length}
							inputRules={{
								required: {
									value: !user.telephone,
									message: "requiredtelephoneValid",
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
								["error", telephoneState.invalid],
								["valid",
									(telephoneState.isDirty && !telephoneState.invalid),
								],
							]}
						/>
						{(errors.telephone || errors.country) && <p className="errorMessage">{t(...telephoneError)}</p>}
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
						{errors.birthday && <p className="errorMessage">{t(...birthdayError)}</p>}
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
						<Link
							to="/appointment"
							id={style.cancel}
							className="button border"
						>
							{t("cancel")}
						</Link>
						<button
							type="submit"
							id={style.signup}
							className="button border"
						>
							{t("signUp")}
						</button>
					</div>
				</form>
				<div className="authQuestion">
					<p>{t("alreadyExistsAccount")}</p>
					<Link
						to="/signin"
						state={{
							state: {
								purpose,
							},
							replace: true,
						}}
					>
						{t("signIn")}
					</Link>
				</div>
			</div>
		</section>
	);
}

SignupForm.propTypes = {
	setFormState: types.func.isRequired,
	setUser: types.func.isRequired,
	user: types.instanceOf(Object).isRequired,
};

export default SignupForm;
