import { useState, useEffect } from "react";
import types from "prop-types";

import format from "@/constants/format.js";
import useOutsideEvent from "@/hooks/useOutsideEvent.js";
import Check from "@/helpers/check.js";

import Select from "@/components/UI/Form/Select/Select.jsx";

import style from "./ChannelInput.module.css";

function ChannelInput({ id, className, onChange, strictIsTel }) {
	const [inputValue, setValue] = useState("");
	const [indexCountry, setIndexCountry] = useState(0);
	const [isOpenSelect, setOpenSelect] = useState(false);

	const isTel = strictIsTel == null ? Check.isStrictNumber(inputValue) : strictIsTel;
	const channelName = isTel ? "telephone" : "email";
	const telCodes = format.telephone.map((obj) => obj.code);
	const placeholder = isTel ? format.telephone[indexCountry].template : "name@example.com";

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
		const val = format.telephone[indexCountry].code + inputValue;

		setIndexCountry(i);
		changeValueByChannel(val);
	}

	function handleChangeValue(e) {
		const val = e.currentTarget.value;

		setValue(val);
	}

	useEffect(() => {
		const val = (isTel ? format.telephone[indexCountry].code : "") + inputValue;

		changeValueByChannel(val);
	}, [inputValue, indexCountry]);

	return (
		<div className={`${style.wrapper} ${className} input`}>
			{isTel && (
				<Select
					id={style.code}
					ref={ref}
					defaultValue={format.telephone[indexCountry].code}
					values={telCodes}
					openState={[isOpenSelect, setOpenSelect]}
					onChange={handleChangeTelCode}
				/>
			)}
			<input
				id={id}
				type="text"
				onChange={handleChangeValue}
				placeholder={placeholder}
				maxLength={isTel ? placeholder.length : null}
				name={channelName}
			/>
		</div>
	);
}

ChannelInput.defaultProps = {
	id: "",
	className: "",
	strictIsTel: null,
};

ChannelInput.propTypes = {
	id: types.string,
	className: types.string,
	onChange: types.func.isRequired,
	strictIsTel: types.bool,
};

export default ChannelInput;
