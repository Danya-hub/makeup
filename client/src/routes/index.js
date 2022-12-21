import { lazy } from "react";
import { Navigate } from "react-router-dom";

const Base = lazy(() => import("@/pages/Base/Base.jsx"));
const AllProcedures = lazy(() => import("@/pages/AllProcedures/AllProcedures.jsx"));
const Error = lazy(() => import("@/pages/Error/Error.jsx"));
const Signup = lazy(() => import("@/pages/Auth/Signup/Signup.jsx"));
const Signin = lazy(() => import("@/pages/Auth/Signin/Signin.jsx"));
const UserProcedures = lazy(() => import("@/pages/UserProcedures/UserProcedures.jsx"));

const routes = [
	{
		path: "/",
		elem: () => <Base />,
		state: {
			title: "Main",
			header: true,
			footer: true,
		},
	},
	{
		path: "/appointment",
		elem: () => <AllProcedures />,
		state: {
			title: "Appointment",
			header: true,
			footer: true,
		},
	},
	{
		path: "/signup",
		elem: () => <Signup />,
		state: {
			title: "Signup",
			header: true,
		},
	},
	{
		path: "/signin",
		elem: () => <Signin />,
		state: {
			title: "Signin",
			header: true,
		},
	},
	{
		path: "/myprocedures",
		elem: (token, msg) => {
			if (token) {
				return <UserProcedures />;
			} else {
				return (
					<Navigate
						to="/signin"
						replace="true"
						state={{
							purpose: msg,
						}}
					/>
				);
			}
		},
		state: {
			title: "Procedures",
			header: true,
			footer: true,
		},
	},
	{
		path: "*",
		elem: () => <Error />,
		state: {
			title: "Error",
		},
	},
];

export { routes as default };
