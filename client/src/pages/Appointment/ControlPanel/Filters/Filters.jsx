import { useContext, memo, useRef } from "react";
import { useTranslation } from "react-i18next";

import CheckboxList from "@/components/UI/Form/CheckboxList/CheckboxList.jsx";
import Details from "@/components/UI/Details/Details.jsx";

import PropsContext from "@/pages/Appointment/context/context.js";
import FilterHelpers from "./helpers/filters.js";

import style from "./Filters.module.css";

function Filters() {
	const { t } = useTranslation();
	const {
		setVisibledGroup,
	} = useContext(PropsContext);

	const values = useRef(FilterHelpers.checkboxListOptions);

	function handleClick(selectedOptions) {
		setVisibledGroup(selectedOptions);
	}

	return (
		<Details
			id={style.list}
			title={t("calendars")}
			isOpen
		>
			<CheckboxList
				values={values.current}
				defaultOptions={{
					myAppointments: "myAppointments",
				}}
				onChange={handleClick}
			/>
		</Details>
	);
}

export default memo(Filters);