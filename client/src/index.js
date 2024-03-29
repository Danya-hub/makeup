import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider as Redux } from "react-redux";

import store from "@/service/store/index.js";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
	// eslint-disable-next-line react/jsx-filename-extension
	<BrowserRouter>
		<Redux store={store}>
			<App />
		</Redux>
	</BrowserRouter>,
);
