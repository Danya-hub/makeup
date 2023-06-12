import { useContext, memo, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";

import CheckboxList from "@/components/UI/Form/CheckboxList/CheckboxList.jsx";
import Details from "@/components/UI/Details/Details.jsx";

import GlobalContext from "@/context/global.js";
import PropsContext from "@/pages/Appointment/context/context.js";
import FilterHelpers from "./helpers/filters.js";

import style from "./Filters.module.css";

function Filters() {
	const { t } = useTranslation();
	const {
		setVisibledGroup,
	} = useContext(PropsContext);
	const {
		isAuth,
	} = useContext(GlobalContext);

	const values = useRef(FilterHelpers.checkboxListOptions);

	const group = isAuth ? "myAppointments" : "otherAppointments";

	const handleClick = useCallback((selectedOptions) => {
		setVisibledGroup(selectedOptions);
	}, []);

	const listRender = useCallback(() => (
		<CheckboxList
			values={values.current}
			defaultOptions={{
				[group]: group,
			}}
			onChange={handleClick}
		/>
	), [isAuth]);

	return (
		<Details
			id={style.list}
			title={t("calendars")}
			render={listRender}
			defaultOpen
		/>
	);
}

export default memo(Filters);