import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";

import { asyncActions } from "@/service/actions/userProcedures.js";

import SimpleLoader from "@/components/UI/SimpleLoader/SimpleLoader.jsx";
import Navigation from "@/pages/ProcDetails/Navigation/Navigation.jsx";

function Comments() {
	const params = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { info: userInfo } = useSelector((state) => state.user);

	const [procedure, setProcedure] = useState(null);

	async function init() {
		const procedureById = await dispatch(asyncActions.getProcedureById(params.id))
			.then((res) => {
				if (res.payload.user.id !== userInfo.id) {
					return navigate("/*");
				}

				return res.payload;
			})
			.catch(() => navigate("/*"));

		setProcedure(procedureById);
	}

	useEffect(() => {
		init();
	}, []);

	return (
		<section>
			<Helmet>
				<title>{procedure ? `${t("procCommentsTitle")} | ${t(procedure.type.name)}` : t("loading")}</title>
			</Helmet>
			{procedure ? (
				<>
					<Navigation
						procedure={procedure}
					/>
					<span>1</span>
				</>
			)
				: <SimpleLoader />}
		</section>
	);
}

export default Comments;