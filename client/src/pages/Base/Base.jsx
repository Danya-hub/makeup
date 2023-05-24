import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

import SimpleLoader from "@/components/UI/SimpleLoader/SimpleLoader.jsx";
import ProcedureSlider from "./ProcedureSlider/ProcedureSlider.jsx";
import MyServices from "./MyServices/MyServices.jsx";
import ScrollTo from "@/components/ScrollTo/ScrollTo.jsx";

import Value from "@/utils/value.js";
import axios from "@/http/axios.js";

function Base() {
	const { t } = useTranslation();

	const [bestWorks, setBestWorks] = useState(null);

	async function init() {
		const bestProceduresResult = await axios
			.get(`/procedure/byColumn/best/1`)
			.then((res) => res.data.map(Value.toDate));

		setBestWorks(bestProceduresResult);
	}

	useEffect(() => {
		init();
	}, []);

	return (
		<section>
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
		</section>
	);
}

export default Base;
