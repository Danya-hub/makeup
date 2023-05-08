import { useState, useContext, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import types from "prop-types";

import Popup from "@/components/UI/Popup/Popup.jsx";
import ChannelInput from "@/components/UI/Form/ChannelInput/ChannelInput.jsx";
import PasswordInput from "@/components/UI/Form/PasswordInput/PasswordInput.jsx";
import Notification from "@/components/UI/Form/Notification/Notification.jsx";
import SimpleLoader from "@/components/UI/SimpleLoader/SimpleLoader.jsx";

import GlobalContext from "@/context/global.js";
import format, { keys } from "@/components/UI/Form/ChannelInput/constants/format.js";
import axios from "@/http/axios.js";
import translate from "@/utils/translate.js";
import { asyncActions } from "@/service/actions/user.js";

import style from "./Email.module.css";

function Email({
	purpose,
	field,
	rules,
	onSuccess,
}) {
	const { t } = useTranslation();
	const { info: userInfo } = useSelector((state) => state.user);
	const {
		isVisiblePopup,
		setVisiblePopup,
		setPopupName,
		setOpenCabinet,
	} = useContext(GlobalContext);
	const {
		handleSubmit,
		formState: {
			errors,
			isSubmitting,
		},
		getValues,
		trigger,
		setError,
		control,
		getFieldState,
	} = useForm({
		mode: "onChange",
		defaultValues: {
			[field]: userInfo[field],
		},
	});
	const dispatch = useDispatch();

	const [[message, status], setMessage] = useState([]);

	const passwordState = getFieldState("confirmationCode");
	const fieldState = getFieldState(field);
	const countryValue = getValues("country");
	const inputRules = rules({
		countryValue,
	});

	const channelInputErrors = useMemo(() => ({
		lesserTelephoneValid: ["lesserTelephoneValid", {
			max: format.telephone[countryValue || keys[0]].template.length,
		}],
		largerTelephoneValid: ["largerTelephoneValid", {
			min: format.telephone[countryValue || keys[0]].template.length,
		}],
		[`${field}SameValid`]: [`${field}SameValid`],
		[`required${field}Valid`]: [`required${field}Valid`],
	}), [countryValue]);

	const confirmationCodeError = errors.confirmationCode?.message;
	const fieldError = channelInputErrors[errors[field]?.message || errors.country?.message]
		|| errors[field]?.message;

	async function onSubmit(data) {
		const compareCodeResult = await axios.indPost("/auth/comparePasswordByEmail", {
			email: userInfo.email,
			password: data.confirmationCode,
			topic: "compareConfirmationCode",
		})
			.catch((res) => {
				if (res.response.status !== 429) {
					const args = translate.object(res.response.data.error.args, t);

					setError("confirmationCode", {
						type: "value",
						message: [res.response.data.error.key, args],
					});
					setMessage([]);

					return res;
				}

				setMessage([res.response.data.error, "error"]);

				return res;
			});

		if (!compareCodeResult.data) {
			return;
		}

		const {
			confirmationCode,
			...newUserInfo
		} = data;

		const editResult = await dispatch(asyncActions.editUserById({
			id: userInfo.id,
			data: newUserInfo,
			field,
		}));

		if (editResult.error) {
			setError(field, {
				type: "value",
				message: [editResult.payload[0].error.key],
			});
			return;
		}

		setVisiblePopup(false);
		setPopupName("");

		if (onSuccess) {
			onSuccess({
				dispatch,
				user: {
					...userInfo,
					[field]: data[field],
				},
			});
		}
	}

	function onClose() {
		setPopupName("");
	}

	function handleCancel() {
		setOpenCabinet(true);
		setVisiblePopup(false);
		setPopupName("");
	}

	async function generateNewConfirmationCode() {
		await axios.indPost("/auth/sendPasswordForCompare", {
			email: userInfo.email,
			topic: "compareConfirmationCode",
			passwordLength: 4,
		})
			// eslint-disable-next-line no-console
			.catch((res) => console.error(res));
	}

	useEffect(() => generateNewConfirmationCode, []);

	return (
		<Popup
			id={style.makeProc}
			className={`${style.editByPassword} form`}
			onClose={onClose}
			isStrictActive={isVisiblePopup}
			strictSwitch={setVisiblePopup}
		>
			<h2 className="title">{t(`${field}EditTitle`)}</h2>
			<p className="message center">{t(purpose)}</p>
			<form onSubmit={handleSubmit(onSubmit)}>
				{message && (
					<Notification
						content={message}
						status={status}
					/>
				)}
				<div
					className={`loader ${isSubmitting ? "isLoading" : ""}`}
				>
					<SimpleLoader />
				</div>
				<div>
					<label htmlFor={field}>
						<h3 className="title">{t(field)}</h3>
					</label>
					<ChannelInput
						id={field}
						channelName={field}
						onSelect={(callback, value) => {
							callback(value);
							trigger();
						}}
						onChange={(callback, value) => {
							callback(value);
							trigger("country");
						}}
						maxLength={inputRules?.minLength?.value}
						defaultValue={{
							country: userInfo.country,
							telephone: userInfo.telephone,
							email: userInfo.email,
						}}
						control={control}
						state={[
							["error", fieldState.invalid || message],
							["valid", (fieldState.isDirty && !fieldState.invalid),
							],
						]}
						inputRules={{
							required: {
								value: true,
								message: `required${field}Valid`,
							},
							validate: (value) => {
								if (userInfo[field] === value) {
									return `${field}SameValid`;
								}

								return true;
							},
							...inputRules,
						}}
					/>
					{(errors[field] || errors.country) && <p className="errorMessage">{t(...fieldError)}</p>}
				</div>
				<div>
					<label htmlFor="confirmationCode">
						<h3 className="title">{t("confirmationCode")}</h3>
					</label>
					<Controller
						name="confirmationCode"
						control={control}
						rules={{
							required: {
								value: true,
								message: ["requiredConfirmationCodeValid"],
							},
						}}
						render={({
							field: { onChange },
						}) => (
							<PasswordInput
								maxLength={4}
								id="confirmationCode"
								name="confirmationCode"
								hasSwitch={false}
								className="field input"
								onChange={(e) => onChange(e.currentTarget.value)}
								state={[
									["error", passwordState.invalid || message],
									["valid", passwordState.isDirty && !passwordState.invalid],
								]}
							/>
						)}
					/>
					{errors.confirmationCode && <p className="errorMessage">{t(...confirmationCodeError)}</p>}
				</div>
				<div className="navigation">
					<button
						id="cancel"
						className="button border"
						type="button"
						onClick={handleCancel}
					>
						{t("cancel")}
					</button>
					<button
						id="edit"
						className="button border"
						type="submit"
					>
						{t("edit")}
					</button>
				</div>
				<div className="authQuestion">
					<p>{t("timeOutQuestion")}</p>
					<button
						type="button"
						onClick={(e) => {
							e.preventDefault();

							generateNewConfirmationCode();
						}}
					>
						{t("sendMore")}
					</button>
				</div>
			</form>
		</Popup>
	);
}

Email.defaultProps = {
	onSuccess: null,
};

Email.propTypes = {
	field: types.string.isRequired,
	purpose: types.string.isRequired,
	rules: types.instanceOf(Object).isRequired,
	onSuccess: types.func,
};

export default Email;