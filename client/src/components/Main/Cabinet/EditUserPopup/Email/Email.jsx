import { useState, useContext } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import types from "prop-types";

import Popup from "@/components/UI/Popup/Popup.jsx";
import ChannelInput from "@/components/UI/Form/ChannelInput/ChannelInput.jsx";
import PasswordInput from "@/components/UI/Form/PasswordInput/PasswordInput.jsx";

import GlobalContext from "@/context/global.js";
import Value from "@/utils/value.js";

import style from "./Email.module.css";

function Email({
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

	const [formValue, setFormValue] = useState({});

	function handleSubmit() {
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
					<label htmlFor={field}>
						<h3 className="title">{t(field)}</h3>
					</label>
					<ChannelInput
						id={field}
						strictIsTel={field === "telephone"}
						className="field"
						onChange={setFormValue}
						defaultValue={userInfo[field]}
					/>
				</div>
				<div>
					<label htmlFor="password">
						<h3 className="title">{t("confirmationCode")}</h3>
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
			</form>
		</Popup>
	);
}

Email.propTypes = {
	field: types.string.isRequired,
	purpose: types.string.isRequired,
};

export default Email;