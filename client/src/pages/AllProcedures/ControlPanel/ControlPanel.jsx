import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import types from "prop-types";

import Sublist from "@/components/UI/Form/Sublist/Sublist.jsx";
import Calendar from "@/components/Calendar/Calendar.jsx";
import Aside from "@/components/Aside/Aside.jsx";

import style from "./ControlPanel.module.css";

ControlPanel.propTypes = {
	viewState: types.object,
	handleChangeDate: types.func,
};

function ControlPanel({ viewState, handleChangeDate }) {
	const { t } = useTranslation();
	const { states } = useSelector((state) => state.procedures);

	return (
		<Aside id={style.controlPanel}>
			<Calendar
				options={viewState}
				onChange={handleChangeDate}
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
		</Aside>
	);
}

export { ControlPanel as default };
