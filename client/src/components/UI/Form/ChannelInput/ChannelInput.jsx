import { useState, useEffect } from "react";
import types from "prop-types";

import { telephone as telephoneFormat } from "@/constant/format.js";
import useOutsideEvent from "@/hooks/useOutsideEvent.js";
import Check from "@/helpers/check.js";

import Select from "@/components/UI/Form/Select/Select.jsx";

import style from "./ChannelInput.module.css";

ChannelInput.propTypes = {
	className: types.string,
	onChange: types.func,
	strictIsTel: types.bool,
};

function ChannelInput({ className = "", onChange, strictIsTel = false, ...props }) {
	const [value, setValue] = useState("");
	const [indexCountry, setIndexCountry] = useState(0);
	const [isOpenSelect, setOpenSelect] = useState(false);
	const ref = useOutsideEvent(handleCloseSelect);

	const isTel = strictIsTel || Check.isStrictNumber(value);
	const channelName = isTel ? "telephone" : "email";

	function handleCloseSelect() {
		setOpenSelect(false);
	}

	function handleChangeTelCode(i) {
		const _value = telephoneFormat.code[indexCountry] + value;

		setIndexCountry(i);
		callback(_value);
	}

	function handleChangeValue(e) {
		const _value = e.currentTarget.value;

		setValue(_value);
	}

	function callback(_value) {
		onChange((prev) => {
			delete prev[isTel ? "email" : "telephone"];

			return {
				...prev,
				[channelName]: _value,
			};
		});
	}

	useEffect(() => {
		const _value = (isTel ? telephoneFormat.code[indexCountry] : "") + value;

		callback(_value);
	}, [value, indexCountry]);

	return (
		<div className={`${style.wrapper} ${className} input`}>
			{isTel && (
				<Select
					id={style.code}
					ref={ref}
					defaultValue={telephoneFormat.code[indexCountry]}
					values={telephoneFormat.code}
					strictSwitch={[isOpenSelect, setOpenSelect]}
					onChange={handleChangeTelCode}
				></Select>
			)}
			<input
				onChange={handleChangeValue}
				name={channelName}
				{...props}
			/>
		</div>
	);
}

export { ChannelInput as default };
