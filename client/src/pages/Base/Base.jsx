import { useLayoutEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

import SimpleLoader from "@/components/UI/SimpleLoader/SimpleLoader.jsx";
import ProcedureSlider from "./ProcedureSlider/ProcedureSlider.jsx";
import MyServices from "./MyServices/MyServices.jsx";
import ScrollTo from "@/components/ScrollTo/ScrollTo.jsx";

import DataFormatter from "@/utils/dataFormatter.js";
import axios from "@/http/axios.js";

function Base() {
	const { t } = useTranslation();

	const [bestWorks, setBestWorks] = useState(null);

	async function init() {
		const bestProceduresResult = await axios
			.get("/procedure/columns/best = 1")
			.then((res) => res.data.map(DataFormatter.toDate));

		setBestWorks(bestProceduresResult);
	}

	useLayoutEffect(() => {
		init();
	}, []);

	return (
		<div>
			<Helmet>
				<title>{t("mainTitle")}</title>
			</Helmet>
			{bestWorks ? (
				<>
					<ScrollTo
						sectionName="bestWorks"
					>
						<ProcedureSlider
							procedures={bestWorks}
						/>
					</ScrollTo>
					<ScrollTo
						sectionName="myServices"
					>
						<MyServices />
					</ScrollTo>
				</>
			) : <SimpleLoader />}
		</div>
	);
}

export default Base;
