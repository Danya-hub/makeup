import { useState, useContext, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import types from "prop-types";

import PasswordInput from "@/components/UI/Form/PasswordInput/PasswordInput.jsx";
import Popup from "@/components/UI/Popup/Popup.jsx";
import StateInput from "@/components/UI/Form/StateInput/StateInput.jsx";
import SimpleLoader from "@/components/UI/SimpleLoader/SimpleLoader.jsx";
import Notification from "@/components/UI/Form/Notification/Notification.jsx";

import GlobalContext from "@/context/global.js";
import translate from "@/utils/translate.js";
import axios from "@/http/axios.js";
import { asyncActions } from "@/service/actions/user.js";

import style from "./Password.module.css";

function Password({
	purpose,
	rules,
	field,
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

	const editableFieldState = getFieldState(field);
	const passwordState = getFieldState("password");

	const editableFieldErrors = useRef({
		[`required${field}Valid`]: [`required${field}Valid`],
		[`${field}SameValid`]: [`${field}SameValid`],
	});

	const passwordError = errors.password?.message;
	const fieldError = editableFieldErrors.current[errors[field]?.message] || errors[field]?.message;

	async function onSubmit(data) {
		const comparePasswordResult = await axios.indPost("/auth/comparePasswordByUserId", {
			...userInfo,
			...data,
		})
			.catch((res) => {
				if (res.response.status !== 429) {
					const args = translate.object(res.response.data.error.args, t);

					setError("password", {
						type: "value",
						message: [res.response.data.error.key, args],
					});
					setMessage([]);

					return res;
				}

				setMessage([res.response.data.error, "error"]);

				return res;
			});

		if (!comparePasswordResult.data) {
			return;
		}

		const editResult = await dispatch(asyncActions.editUserById({
			id: userInfo.id,
			data: {
				[field]: data[field],
			},
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
		setVisiblePopup(false);
		setPopupName("");
	}

	function handleCancel() {
		setOpenCabinet(true);
		setVisiblePopup(false);
		setPopupName("");
	}

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
					<Controller
						name={field}
						control={control}
						render={({
							field: { onChange },
						}) => (
							<StateInput
								id={field}
								onChange={onChange}
								defaultValue={userInfo[field]}
								state={[
									["error", editableFieldState.invalid],
									["valid", editableFieldState.isDirty && !editableFieldState.invalid],
								]}
							/>
						)}
						rules={{
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
							...rules,
						}}
					/>
					{errors[field] && <p className="errorMessage">{t(...fieldError)}</p>}
				</div>
				<div>
					<label htmlFor="password">
						<h3 className="title">{t("currentPassword")}</h3>
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
					{errors.password && <p className="errorMessage">{t(...passwordError)}</p>}
				</div>
				<div className="navigation">
					<button
						id="cancel"
						type="button"
						className="button border"
						onClick={handleCancel}
					>
						{t("cancel")}
					</button>
					<button
						id="edit"
						type="submit"
						className="button border"
					>
						{t("edit")}
					</button>
				</div>
			</form>
		</Popup>
	);
}

Password.defaultProps = {
	onSuccess: null,
};

Password.propTypes = {
	field: types.string.isRequired,
	purpose: types.string.isRequired,
	rules: types.instanceOf(Object).isRequired,
	onSuccess: types.func,
};

export default Password;