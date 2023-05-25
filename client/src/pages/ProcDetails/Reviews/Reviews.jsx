import { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";

import { asyncActions } from "@/service/actions/userProcedures.js";
import GlobalContext from "@/context/global.js";

import SimpleLoader from "@/components/UI/SimpleLoader/SimpleLoader.jsx";
import Navigation from "@/pages/ProcDetails/components/Navigation/Navigation.jsx";
import Form from "./Form/Form.jsx";
import Items from "./Items/Items.jsx";
import TopPanel from "./TopPanel/TopPanel.jsx";
import ProcDetailsPopup from "@/pages/ProcDetails/ProcDetailsPopup/ProcDetailsPopup.jsx";
import Notification from "@/components/UI/Form/Notification/Notification.jsx";

import style from "./Reviews.module.css";

function Reviews() {
	const params = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { info: userInfo } = useSelector((state) => state.user);
	const { t } = useTranslation();
	const {
		setPopup,
		setVisiblePopup,
	} = useContext(GlobalContext);

	const [reviews, setReviews] = useState(null);
	const [procedure, setProcedure] = useState(null);
	const [[message, status], setMessage] = useState([]);

	async function init() {
		const procedureById = await dispatch(asyncActions.getProcedureById(params.id))
			.then((res) => {
				if (res.payload.user.id !== userInfo.id) {
					return navigate("/notFound");
				}

				return res.payload;
			})
			.catch(() => navigate("/notFound"));

		const reviewsById = await dispatch(asyncActions.getReviewsByProcId(`id=${params.id}`))
			.then((res) => res.payload)
			.catch(() => navigate("/notFound"));

		setProcedure(procedureById);
		setReviews(reviewsById);
	}

	async function handleMakeReview(value) {
		const makeReviewResult = await dispatch(asyncActions.makeReview(value));

		if (makeReviewResult.error) {
			setMessage([makeReviewResult.payload.data.error, "error"]);
			return;
		}

		await dispatch(asyncActions.updateProc([{
			...procedure,
			stars: value.stars,
		}, false]));
	}

	useEffect(() => {
		init();
	}, []);

	return (
		<section>
			<Helmet>
				<title>{reviews ? t("procReviewsTitle") : t("loading")}</title>
			</Helmet>
			{reviews ? (
				<>
					<Navigation
						procedure={{
							id: params.id,
						}}
					/>
					<TopPanel
						procedure={procedure}
					/>
					{message && (
						<Notification
							content={message}
							status={status}
						/>
					)}
					<div
						className={style.wrapper}
					>
						<Items
							reviews={reviews}
							hasActions
						/>
						<Form
							onSubmit={(data) => {
								setVisiblePopup(true);
								setPopup(["make", {
									make: (value) => handleMakeReview({
										...data,
										...value,
									}),
								}]);
							}}
						/>
					</div>
				</>

			)
				: <SimpleLoader />}
			<ProcDetailsPopup />
		</section>
	);
}

export default Reviews;