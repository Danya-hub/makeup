import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import types from "prop-types";

import Loader from "@/components/Loader/Loader.jsx";
import Cabinet from "./Cabinet/Cabinet.jsx";

import routes from "@/routes/index.js";
import { useTranslation } from "react-i18next";

Main.propTypes = {
	openCabinetState: types.array,
};

function Main({ openCabinetState }) {
	const { t } = useTranslation();

	const accessToken = localStorage.getItem("token");

	return (
		<main>
			<div className="content">
				<Suspense fallback={<Loader />}>
					<Routes>
						{routes.map((route) => (
							<Route
								key={route.path}
								path={route.path}
								element={route.elem(accessToken, t("noAccessToPage"))}
							></Route>
						))}
					</Routes>
				</Suspense>
			</div>
			<Cabinet openCabinetState={openCabinetState}></Cabinet>
		</main>
	);
}

export { Main as default };
