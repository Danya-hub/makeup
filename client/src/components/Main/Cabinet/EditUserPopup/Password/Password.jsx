import { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import PasswordInput from "@/components/UI/Form/PasswordInput/PasswordInput.jsx";
import Popup from "@/components/UI/Popup/Popup.jsx";

import GlobalContext from "@/context/global.js";
import Value from "@/utils/value.js";
import { asyncActions } from "@/service/redusers/user.js";

import style from "./Password.module.css";

function Password({
	purpose,
	field,
}) {
	const { t } = useTranslation();
	const { info: userInfo } = useSelector((state) => state.user);
	const {
		isVisiblePopup,
		setVisiblePopup,
		setPopupName,
		setOpenCabinet,
	} = useContext(GlobalContext);
	const dispatch = useDispatch();

	const [formValue, setFormValue] = useState({});

	async function handleSubmit() {
		// const res = await dispatch(
		// 	asyncActions.comparePassword(formValue),
		// );

		// if (res.error) {
		// 	return;
		// }

	}

	function onClose() {
		setPopupName("");
	}

	function handleCancel() {
		setOpenCabinet(true);
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
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="username">
						<h3 className="title">{t(field)}</h3>
					</label>
					<input
						id={field}
						type="text"
						name={field}
						className="input field"
						defaultValue={userInfo[field]}
						placeholder={userInfo[field]}
						onChange={(e) => Value.fromInput(e, setFormValue)}
						autoComplete="off"
					/>
				</div>
				<div>
					<label htmlFor="password">
						<h3 className="title">{t("currentPassword")}</h3>
					</label>
					<PasswordInput
						id="password"
						name="password"
						className="field input"
						onChange={(e) => Value.fromInput(e, setFormValue)}
					/>
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

Password.propTypes = {
	field: types.string.isRequired,
	purpose: types.string.isRequired,
};

export default Password;