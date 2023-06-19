import { useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

import Value from "@/utils/value.js";
import { asyncActions } from "@/service/actions/appointments.js";

import SimpleLoader from "@/components/UI/SimpleLoader/SimpleLoader.jsx";
import BaseInfo from "./BaseInfo/BaseInfo.jsx";
import Description from "./Description/Description.jsx";
import TopNavigation from "@/pages/ProcDetails/components/TopNavigation/TopNavigation.jsx";

function ProcDetails() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const params = useParams();

	const [procedure, setProcedure] = useState(null);
	const [reviews, setReviews] = useState(null);

	async function init() {
		const procedureById = await dispatch(asyncActions.getProcedureById(params.id))
			.then((res) => {
				const isEmpty = Value.isEmptyObject(res.payload);

				if (isEmpty) {
					return navigate("/notFound");
				}

				return res.payload;
			})
			.catch(() => navigate("/notFound"));

		const reviewsById = await dispatch(asyncActions.getReviewsByQuery(`id=${params.id}&limit=6`))
			.then((res) => res.payload)
			.catch(() => navigate("/notFound"));

		setProcedure(procedureById);
		setReviews(reviewsById);
	}

	useLayoutEffect(() => {
		init();
	}, []);

	return (
		<section>
			<Helmet>
				<title>{procedure ? `${t("procDetailsTitle")} | ${t(procedure.type.name)}` : t("loading")}</title>
			</Helmet>
			{procedure ? (
				<>
					<TopNavigation
						procedure={procedure}
					/>
					<BaseInfo
						procedure={procedure}
					/>
					<Description
						procedure={procedure}
						reviews={reviews}
					/>
				</>
			)
				: <SimpleLoader />}
		</section>
	);
}

export default ProcDetails;
