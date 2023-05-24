import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";

import Popup from "@/components/UI/Popup/Popup.jsx";
import Table from "./Table/Table.jsx";
import Total from "./Total/Total.jsx";
import Recaptcha from "@/components/UI/Form/Recaptcha/Recaptcha.jsx";
import SimpleLoader from "@/components/UI/SimpleLoader/SimpleLoader.jsx";

import { asyncActions } from "@/service/redusers/userProcedures.js";
import ProcConfig from "@/config/procedures.js";
import GlobalContext from "@/context/global.js";

import style from "./Design.module.css";

function DesignProc() {
	const {
		isVisiblePopup,
		setVisiblePopup,
		setPopup,
	} = useContext(GlobalContext);
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const {
		newProcedures,
	} = useSelector((state) => state.userProcedures);
	const {
		control,
		handleSubmit,
		formState: {
			errors,
			isSubmitting,
		},
	} = useForm({
		mode: "onSubmit",
	});

	const recaptchaError = errors.recaptcha?.message;

	async function onSubmit() {
		await dispatch(asyncActions.createNewProcedures(newProcedures));

		setVisiblePopup(false);
		setPopup(["", null]);
	}

	return (
		<Popup
			id={style.designProc}
			onClose={() => setPopup(["make", null])}
			isSimple={false}
			isStrictActive={isVisiblePopup}
			strictSwitch={setVisiblePopup}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div
					className={`loader ${isSubmitting ? "isLoading" : ""}`}
				>
					<SimpleLoader />
				</div>
				<div className={style.top}>
					<p>
						<b>
							{t("availableCountAppointments")}
							:
						</b>
						{ProcConfig.MAX_COUNT_PROCEDURE}
					</p>
				</div>
				<Table />
				<Total />
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
				<div className={style.buttons}>
					<button
						type="button"
						id={style.add}
						className="button border"
						onClick={() => setPopup(["make", null])}
					>
						{t("addMore")}
					</button>
					<button
						type="submit"
						id={style.design}
						className="button border"
					>
						{t("continue")}
					</button>
				</div>
			</form>
		</Popup>
	);
}

export default DesignProc;
