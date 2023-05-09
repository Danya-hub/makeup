import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Cabinet from "./Cabinet/Cabinet.jsx";
import EditUserPopup from "./Cabinet/EditUserPopup/EditUserPopup.jsx";

import routes from "@/routes/index.jsx";

function Main() {
	return (
		<main>
			<div className="content">
				<Suspense>
					<Routes>
						{routes.map((route) => (
							<Route
								key={route.url}
								path={route.url}
								element={route.elem()}
							/>
						))}
					</Routes>
				</Suspense>
			</div>
			<Cabinet />
			<EditUserPopup />
		</main>
	);
}

export default Main;
