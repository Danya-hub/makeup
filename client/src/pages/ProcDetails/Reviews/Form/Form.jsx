import { useContext, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import types from "prop-types";

import StateInput from "@/components/UI/Form/StateInput/StateInput.jsx";
import Notification from "@/components/UI/Form/Notification/Notification.jsx";

import ReviewContext from "@/pages/ProcDetails/context/reviews.js";
import GlobalContext from "@/context/global.js";

import style from "./Form.module.css";

function Form({
	onSubmit,
}) {
	const params = useParams();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { info: userInfo } = useSelector((state) => state.user);
	const {
		reviewFormValue,
		actionName,
	} = useContext(ReviewContext);
	const {
		handleSubmit,
		control,
		formState: {
			errors,
		},
		getFieldState,
	} = useForm({
		mode: "onSubmit",
		defaultValues: reviewFormValue,
	});
	const {
		isAuth,
	} = useContext(GlobalContext);

	const formRef = useRef(null);

	const reviewState = getFieldState("text");
	const reviewError = errors.text?.message;

	useEffect(() => {
		formRef.current.parentNode.style.paddingBottom = `${formRef.current.offsetHeight}px`;
	}, [formRef.current]);

	return (
		<div
			className={style.form}
			ref={formRef}
		>
			{!isAuth && (
				<Notification
					content={{
						key: t("signinToAddReview"),
					}}
					status="warning"
				/>
			)}
			<form
				className={style[actionName]}
				onSubmit={handleSubmit((data) => {
					if (!isAuth) {
						navigate("/signin", {
							state: {
								purpose: "warningAuthToMakeAppointment",
							},
						});
						return;
					}

					onSubmit({
						service: parseInt(params.id, 10),
						user: userInfo.id,
						...reviewFormValue,
						...data,
					});
				})}
			>
				<div>
					<Controller
						name="text"
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
								defaultValue={reviewFormValue.text}
								disabled={!isAuth}
							/>
						)}
						rules={{
							required: {
								value: !reviewFormValue.text,
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
						disabled={!isAuth}
					>
						<i
							className="fa fa-location-arrow"
							aria-hidden="true"
						/>
					</button>
				</div>
				{errors.text && <p className="errorMessage">{t(...reviewError)}</p>}
			</form>
		</div>
	);
}

Form.propTypes = {
	onSubmit: types.func.isRequired,
};

export default Form;