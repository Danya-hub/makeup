import { useContext } from "react";
import { useTranslation } from "react-i18next";

import CheckboxList from "@/components/UI/Form/CheckboxList/CheckboxList.jsx";
import Details from "@/components/UI/Details/Details.jsx";

import PropsContext from "@/pages/Appointment/context.js";
import FilterHelpers from "./helpers/filters.js";

import style from "./Filters.module.css";

function Filters() {
	const { t } = useTranslation();
	const {
		visibledGroupProcedures: [, setVisibledGroup],
	} = useContext(PropsContext);

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
				values={FilterHelpers.checkboxListOptions}
				defaultOptions={{
					myAppointments: "myAppointments",
				}}
				onChange={handleClick}
			/>
		</Details>
	);
}

export default Filters;