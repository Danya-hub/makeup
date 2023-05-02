/* eslint-disable react/jsx-props-no-spreading */
import { memo } from "react";
import { useController } from "react-hook-form";
import types from "prop-types";

import format, { keys } from "./constants/format.js";

import Select from "@/components/UI/Form/Select/Select.jsx";
import StateInput from "@/components/UI/Form/StateInput/StateInput.jsx";

import style from "./ChannelInput.module.css";

function ChannelInput({
	id,
	className,
	channelName,
	defaultValue,
	control,
	inputRules,
	onChange,
	state,
	maxLength,
	...props
}) {
	const {
		field: codeField,
	} = useController({
		name: "country",
		control,
		defaultValue: format.telephone[defaultValue.country || keys[0]].country,
		rules: {
			validate: (value, formValues) => {
				const max = format.telephone[value].template.length;

				if (max > formValues.telephone?.length) {
					return "lesserTelephoneValid";
				}

				if (max < formValues.telephone?.length) {
					return "largerTelephoneValid";
				}

				return true;
			},
		},
	});
	const {
		field: inputField,
	} = useController({
		name: channelName,
		control,
		defaultValue: defaultValue[channelName] || "",
		rules: inputRules,
	});

	const telCodes = keys.map((key) => format.telephone[key].code);
	const placeholder = channelName === "telephone" ? format.telephone[codeField.value].template : "name@example.com";

	return (
		<div className={`${style.channelInput} ${className}`}>
			{channelName === "telephone" && (
				<Select
					id={style.code}
					defaultValue={format.telephone[codeField.value].code}
					values={telCodes}
					onChange={(i) => {
						codeField.onChange(format.telephone[keys[i]].country);
					}}
				/>
			)}
			<StateInput
				id={id}
				onChange={(e) => {
					onChange(inputField.onChange, e.currentTarget.value);
				}}
				defaultValue={defaultValue[channelName]}
				placeholder={placeholder}
				maxLength={maxLength}
				name={channelName}
				state={state}
				{...props}
			/>
		</div>
	);
}

ChannelInput.defaultProps = {
	id: "",
	className: "",
	defaultValue: {},
	inputRules: {},
	onChange: null,
	maxLength: null,
};

ChannelInput.propTypes = {
	id: types.string,
	className: types.string,
	defaultValue: types.instanceOf(Object),
	channelName: types.string.isRequired,
	control: types.instanceOf(Object).isRequired,
	state: types.instanceOf(Object).isRequired,
	inputRules: types.instanceOf(Object),
	onChange: types.func,
	maxLength: types.number,
};

export default memo(ChannelInput);
