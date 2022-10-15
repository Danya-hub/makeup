import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import types from "prop-types";

import Sublist from "@/components/Form/Sublist/Sublist.jsx";
import Calendar from "@/features/Calendar/Calendar.jsx";

import style from "./Aside.module.css";

Aside.propTypes = {
	view: types.array,
	switchDayOnOther: types.func,
};

function Aside({ view, switchDayOnOther }) {
	const { t } = useTranslation();
	const { states } = useSelector((state) => state.procedure);

	const [viewDate] = view;

	return (
		<aside>
			<Calendar
				date={viewDate}
				onChange={switchDayOnOther}
			></Calendar>
			<Sublist
				id={style.designation}
				isOpen={true}
				title={t("designation")}
				values={states}
			>
				{(obj) => (
					<Fragment>
						<i
							className="fa fa-bookmark color"
							aria-hidden="true"
							style={{
								WebkitTextStroke: obj.color === "white" ? "1px rgb(var(--black))" : "",
								color: `rgb(var(--${obj.color}))`,
							}}
						></i>
						<p className="text">{t(obj.name)}</p>
					</Fragment>
				)}
			</Sublist>
		</aside>
	);
}

export { Aside as default };
