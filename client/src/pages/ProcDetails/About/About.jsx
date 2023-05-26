import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

import Value from "@/utils/value.js";
import { asyncActions } from "@/service/actions/userProcedures.js";

import SimpleLoader from "@/components/UI/SimpleLoader/SimpleLoader.jsx";
import Info from "./Info/Info.jsx";
import Description from "./Description/Description.jsx";
import Navigation from "@/pages/ProcDetails/components/Navigation/Navigation.jsx";

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

		const reviewsById = await dispatch(asyncActions.getReviewsByProcId(`id=${params.id}&limit=6`))
			.then((res) => res.payload)
			.catch(() => navigate("/notFound"));

		setProcedure(procedureById);
		setReviews(reviewsById);
	}

	useEffect(() => {
		init();
	}, []);

	return (
		<section>
			<Helmet>
				<title>{procedure ? `${t("procDetailsTitle")} | ${t(procedure.type.name)}` : t("loading")}</title>
			</Helmet>
			{procedure ? (
				<>
					<Navigation
						procedure={procedure}
					/>
					<Info
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
