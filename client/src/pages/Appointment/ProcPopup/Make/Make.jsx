import { useState, useContext, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";

import Popup from "@/components/UI/Popup/Popup.jsx";
import Select from "@/components/UI/Form/Select/Select.jsx";
import Checkbox from "@/components/UI/Form/Checkbox/Checkbox.jsx";
import TimeInput from "@/pages/Appointment/ProcPopup/TimeInput/TimeInput.jsx";

import RightArrowSrc from "@/assets/image/rightArrow.svg";
import MessageHelper from "./helpers/message.js";
import GlobalContext from "@/context/global.js";
import FormatDate from "@/utils/formatDate.js";
import ProcConfig from "@/config/procedures.js";
import docs from "@/utils/docs.js";
import {
	actions as appointmentsActions,
} from "@/service/redusers/appointments.js";

import style from "./Make.module.css";

function MakeProc() {
	const { t } = useTranslation();
	const {
		appointments,
	} = useSelector((state) => state);
	const dispatch = useDispatch();
	const {
		isVisiblePopup,
		setVisiblePopup,
		setPopup,
	} = useContext(GlobalContext);
	const {
		control,
		handleSubmit,
		formState: {
			errors,
		},
		reset,
	} = useForm({
		mode: "onChange",
	});

	const Message = useMemo(
		() => MessageHelper.check(appointments),
		[appointments.availableTypes, appointments.newProcedures],
	);

	const contractError = errors.contract?.message;
	const [currentProcedure, indexSelectedProcedure] = appointments.currentProcedure;

	const [isOpenCalendar, setOpenCalendar] = useState(false);

	function onSubmit() {
		if (Message.component) {
			return;
		}

		if (appointments.newProcedures[indexSelectedProcedure]) {
			dispatch(appointmentsActions.updateProcStateByIndex([indexSelectedProcedure, false]));
		} else {
			dispatch(appointmentsActions.addProc());
		}

		const scrollYInPx = (currentProcedure.hour - ProcConfig.START_WORK_TIME)
			* appointments.hourHeightInPx;
		window.scrollTo(0, scrollYInPx);
		reset();
	}

	function handleChangeProcName(ind) {
		const startProcMinutes = currentProcedure.hour * appointments.hourHeightInPx;
		const finishProcMinutes = startProcMinutes + appointments.availableTypes[ind].duration
			* appointments.hourHeightInPx;

		const newCurrProc = {
			...currentProcedure,
			finishProcTime: FormatDate.minutesToDate(
				finishProcMinutes,
				currentProcedure.finishProcTime,
			),
			type: appointments.availableTypes[ind],
		};

		dispatch(appointmentsActions.updateCurrProc([[newCurrProc, indexSelectedProcedure]]));
	}

	function onClose() {
		dispatch(appointmentsActions.updateCurrProc([
			[appointments.defaultProcedure, appointments.newProcedures.length],
			false,
		]));
		setPopup(["", null]);
	}

	const onConirmContract = useCallback((isConfirm) => {
		dispatch(appointmentsActions.setCurrProcValue(
			["contract", isConfirm ? docs[currentProcedure.type.contract] : null],
		));
	}, []);

	return (
		<Popup
			id={style.makeProc}
			onClose={onClose}
			isSimple={false}
			isStrictActive={isVisiblePopup}
			strictSwitch={setVisiblePopup}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				{Message.component && Message.component()}
				<div
					className={style.input}
					id="procedureName"
				>
					<h3 className={style.title}>{t("procedure")}</h3>
					<Select
						id="procedureName"
						defaultValue={t(currentProcedure.type?.name)}
						values={appointments.availableTypes.map((obj) => t(obj.name))}
						onChange={handleChangeProcName}
					/>
				</div>
				<div id="time">
					<h3 className={style.title}>{t("time")}</h3>
					<TimeInput
						isOpenCalendar={isOpenCalendar}
						setOpenCalendar={setOpenCalendar}
					/>
				</div>
				{currentProcedure.type.contract && (
					<div className={style.signature}>
						<Controller
							name="contract"
							control={control}
							render={({
								field: { onChange },
							}) => (
								<>
									<Checkbox
										className={style.agreeTerms}
										text={t("agreeTerms")}
										onCheck={(confirm) => {
											onConirmContract(confirm);
											onChange(confirm);
										}}
										checked={Boolean(currentProcedure.contract)}
									/>
									<a
										target="_blank"
										className={style.pdfLink}
										href={docs[currentProcedure.type.contract][0]}
										title={t("more")}
										rel="noreferrer"
									>
										{t("readTerms")}
									</a>
								</>
							)}
							rules={{
								required: {
									value: true,
									message: "requiredContractValid",
								},
							}}
						/>
						{errors.contract && <p className="errorMessage">{t(contractError)}</p>}
					</div>
				)}
				<div className={style.buttons}>
					<button
						type="submit"
						id={style.add}
						className="button border"
					>
						{t("add")}
					</button>
					<button
						type="button"
						id={style.design}
						className="button border"
						onClick={() => setPopup(["design", null])}
						disabled={!appointments.newProcedures.length}
					>
						{Boolean(appointments.newProcedures.length)
							&& <span id={style.countProcedures}>{appointments.newProcedures.length}</span>}
						{t("design")}
						<img
							className={style.arrow}
							src={RightArrowSrc}
							alt="rightArrow"
						/>
					</button>
				</div>
			</form>
		</Popup>
	);
}

export default MakeProc;
