import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import types from "prop-types";

import StateInput from "@/components/UI/Form/StateInput/StateInput.jsx";

import style from "./Form.module.css";

function Form({
	onSubmit,
}) {
	const params = useParams();
	const { info: userInfo } = useSelector((state) => state.user);
	const {
		handleSubmit,
		control,
		formState: {
			errors,
		},
		getFieldState,
	} = useForm({
		mode: "onSubmit",
	});
	const { t } = useTranslation();

	const reviewState = getFieldState("review");
	const reviewError = errors.review?.message;

	return (
		<div
			className={style.form}
		>
			<form
				onSubmit={handleSubmit((data) => {
					onSubmit({
						service: parseInt(params.id, 10),
						user: userInfo.id,
						text: data.review,
					});
				})}
			>
				<div>
					<Controller
						name="review"
						control={control}
						render={({
							field: { onChange },
						}) => (
							<StateInput
								id="review"
								onChange={onChange}
								placeholder={t("writeReviewInput")}
								state={[
									["error", reviewState.invalid],
								]}
							/>
						)}
						rules={{
							required: {
								value: true,
								message: ["requiredReviewValid"],
							},
							minLength: {
								value: 3,
								message: ["largerReviewValid", {
									min: 3,
								}],
							},
							maxLength: {
								value: 100,
								message: ["lesserReviewValid", {
									max: 100,
								}],
							},
						}}
					/>
					<button
						type="submit"
						className="button"
					>
						<i
							className="fa fa-location-arrow"
							aria-hidden="true"
						/>
					</button>
				</div>
				{errors.review && <p className="errorMessage">{t(...reviewError)}</p>}
			</form>
		</div>
	);
}

Form.propTypes = {
	onSubmit: types.func.isRequired,
};

export default Form;