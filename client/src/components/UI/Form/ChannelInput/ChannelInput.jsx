import { useState, useEffect } from "react";
import types from "prop-types";

import constants from "@/constants/format.js";
import useOutsideEvent from "@/hooks/useOutsideEvent.js";
import Check from "@/helpers/check.js";

import Select from "@/components/UI/Form/Select/Select.jsx";

import style from "./ChannelInput.module.css";

function ChannelInput({ id, className, onChange, strictIsTel }) {
	const [inputValue, setValue] = useState("");
	const [indexCountry, setIndexCountry] = useState(0);
	const [isOpenSelect, setOpenSelect] = useState(false);

	const isTel = strictIsTel || Check.isStrictNumber(inputValue);
	const channelName = isTel ? "telephone" : "email";

	function handleCloseSelect() {
		setOpenSelect(false);
	}

	const ref = useOutsideEvent(handleCloseSelect);

	function changeValueByChannel(val) {
		onChange((prev) => {
			const array = prev;
			if (!strictIsTel) {
				delete array[isTel ? "email" : "telephone"];
			}

			return {
				...array,
				[channelName]: val,
			};
		});
	}

	function handleChangeTelCode(i) {
		const val = constants.telephone.code[indexCountry] + inputValue;

		setIndexCountry(i);
		changeValueByChannel(val);
	}

	function handleChangeValue(e) {
		const val = e.currentTarget.value;

		setValue(val);
	}

	useEffect(() => {
		const val = (isTel ? constants.telephone.code[indexCountry] : "") + inputValue;

		changeValueByChannel(val);
	}, [inputValue, indexCountry]);

	return (
		<div className={`${style.wrapper} ${className} input`}>
			{isTel && (
				<Select
					id={style.code}
					ref={ref}
					defaultValue={constants.telephone.code[indexCountry]}
					values={constants.telephone.code}
					openState={[isOpenSelect, setOpenSelect]}
					onChange={handleChangeTelCode}
				/>
			)}
			<input
				id={id}
				type="text"
				onChange={handleChangeValue}
				name={channelName}
			/>
		</div>
	);
}

ChannelInput.defaultProps = {
	id: "",
	className: "",
	strictIsTel: false,
};

ChannelInput.propTypes = {
	id: types.string,
	className: types.string,
	onChange: types.func.isRequired,
	strictIsTel: types.bool,
};

export default ChannelInput;
