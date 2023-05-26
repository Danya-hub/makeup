import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";

import GlobalContext from "@/context/global.js";
import ReviewContext from "@/pages/ProcDetails/context/reviews.js";

import Popup from "@/components/UI/Popup/Popup.jsx";
import Recaptcha from "@/components/UI/Form/Recaptcha/Recaptcha.jsx";
import SimpleLoader from "@/components/UI/SimpleLoader/SimpleLoader.jsx";

import style from "./MakeReviewPopup.module.css";

const COUNT_STARS = 5;

function MakeReviewPopup() {
	const {
		isVisiblePopup,
		setVisiblePopup,
		popup: [, popupActions],
		setPopup,
	} = useContext(GlobalContext);
	const {
		actionName,
		setReviewFormValue,
	} = useContext(ReviewContext);
	const {
		handleSubmit,
		formState: {
			errors,
			isSubmitting,
		},
		control,
		getValues,
		trigger,
	} = useForm({
		mode: "onSubmit",
	});
	const { t } = useTranslation();

	function onClose() {
		setPopup([]);
		setVisiblePopup(false);
		setReviewFormValue([{}, "make"]);
	}

	async function onSubmit(data) {
		if (popupActions[actionName]) {
			await popupActions[actionName]({
				stars: data.stars,
			});
		}

		setPopup([]);
		setVisiblePopup(false);
	}

	function handleSelectStars(e, onChange) {
		const stars = parseInt(e.target.id, 10) + 1;

		if (Number.isNaN(stars)) {
			return;
		}

		onChange(stars);
		trigger("stars");
	}

	function handleCancel() {
		setPopup([]);
		setVisiblePopup(false);
		setReviewFormValue([{}, "make"]);
	}

	const recaptchaError = errors.recaptcha?.message;
	const starsError = errors.stars?.message;
	const starsValue = getValues("stars") || 0;

	return (
		<Popup
			id={style.makeReview}
			className="form"
			onClose={onClose}
			isStrictActive={isVisiblePopup}
			strictSwitch={setVisiblePopup}
		>
			<h3>{t("evaluateResultTitle")}</h3>
			<p>{t("evaluateResultBeforeAddText")}</p>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div
					className={`loader ${isSubmitting ? "isLoading" : ""}`}
				>
					<SimpleLoader />
				</div>
				<div>
					<Controller
						name="stars"
						control={control}
						rules={{
							required: {
								value: true,
								message: "requiredStarsValid",
							},
						}}
						render={({
							field: { onChange },
						}) => (
							<button
								className={`${style.stars} button`}
								type="button"
								onClick={(e) => handleSelectStars(e, onChange)}
							>
								{[...Array(COUNT_STARS)].map((_, i) => (
									<i
										id={i}
										// eslint-disable-next-line react/no-array-index-key
										key={`${i}/star`}
										title={i + 1}
										className={i >= starsValue ? "fa fa-star-o" : "fa fa-star"}
										aria-hidden="true"
									/>
								))}
							</button>
						)}
					/>
					{errors.stars && <p className="errorMessage">{t(starsError)}</p>}
				</div>
				<div>
					<Controller
						name="recaptcha"
						control={control}
						rules={{
							required: {
								value: true,
								message: "requiredRecaptchaValid",
							},
						}}
						render={({
							field: { onChange },
						}) => (
							<Recaptcha
								onChange={onChange}
							/>
						)}
					/>
					{errors.recaptcha && <p className="errorMessage">{t(recaptchaError)}</p>}
				</div>
				<div className="navigation">
					<button
						id="cancel"
						className="button border"
						type="button"
						onClick={handleCancel}
					>
						{t("cancel")}
					</button>
					<button
						id="make"
						className="button border"
						type="submit"
					>
						{t("submit")}
					</button>
				</div>
			</form>
		</Popup>
	);
}

export default MakeReviewPopup;