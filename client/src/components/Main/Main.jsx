import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import types from "prop-types";

import Loader from "@/components/Loader/Loader.jsx";
import Cabinet from "./Cabinet/Cabinet.jsx";

import routes from "@/routes/index.js";

Main.propTypes = {
	openCabinetState: types.array,
};

function Main({ openCabinetState }) {
	const { t } = useTranslation();
	const { info: userInfo } = useSelector((state) => state.user);
	
	return (
		<main>
			<div className="content">
				<Suspense fallback={<Loader />}>
					<Routes>
						{routes.map((route) => (
							<Route
								key={route.path}
								path={route.path}
								element={route.elem(userInfo, t("noAccessToPage"))}
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
