import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import types from "prop-types";

import Cabinet from "./Cabinet/Cabinet.jsx";

import routes from "@/routes/index.js";

Main.propTypes = {
	openCabinetState: types.array,
};

function Main({ openCabinetState }) {
	return (
		<main>
			<div className="content">
				<Suspense>
					<Routes>
						{routes.map((route) => (
							<Route
								key={route.path}
								path={route.path}
								element={route.elem()}
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
