import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import types from "prop-types";

import Cabinet from "./Cabinet/Cabinet.jsx";

import routes from "@/routes/index.jsx";

function Main({ openCabinetState }) {
	const [isOpenCabinet] = openCabinetState;

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
							/>
						))}
					</Routes>
				</Suspense>
			</div>
			{isOpenCabinet && <Cabinet openCabinetState={openCabinetState} />}
		</main>
	);
}

Main.propTypes = {
	openCabinetState: types.instanceOf(Array).isRequired,
};

export default Main;
