import { lazy } from "react";

const Base = lazy(() => import("@/pages/Base/Base.jsx"));
const Appointment = lazy(() => import("@/pages/Appointment/Appointment.jsx"));
const NotFound = lazy(() => import("@/pages/Error/NotFound/NotFound.jsx"));
const Signup = lazy(() => import("@/pages/Auth/Signup/Signup.jsx"));
const Signin = lazy(() => import("@/pages/Auth/Signin/Signin.jsx"));
const ResetPassword = lazy(() => import("@/pages/Auth/ResetPassword/ResetPassword.jsx"));
const UserProcedures = lazy(() => import("@/pages/UserProcedures/UserProcedures.jsx"));
const ProcDetails = lazy(() => import("@/pages/ProcDetails/ProcDetails.jsx"));

const routes = [
	{
		url: "/",
		elem: () => <Base />,
		state: {
			pathname: "/",
			title: "mainTitle",
			header: true,
			footer: true,
		},
	},
	{
		url: "/appointment",
		elem: () => <Appointment />,
		state: {
			pathname: "/appointment",
			title: "appointmentTitle",
			header: true,
			footer: true,
		},
	},
	{
		url: "/signup",
		elem: () => <Signup />,
		state: {
			pathname: "/signup",
			title: "signUpTitle",
			header: true,
		},
	},
	{
		url: "/signin",
		elem: () => <Signin />,
		state: {
			pathname: "/signin",
			title: "signInTitle",
			header: true,
		},
	},
	{
		url: "/myprocedures",
		elem: () => <UserProcedures />,
		state: {
			pathname: "/myprocedures",
			title: "myProceduresTitle",
			header: true,
			footer: true,
		},
	},
	{
		url: "/resetPassword",
		elem: () => <ResetPassword />,
		state: {
			pathname: "/resetPassword",
			title: "resetPasswordTitle",
			header: true,
			footer: true,
		},
	},
	{
		url: "/details",
		elem: () => <ProcDetails />,
		state: {
			pathname: "/details",
			title: "procDetailsTitle",
			header: true,
			footer: true,
		},
	},
	{
		url: "*",
		elem: () => <NotFound />,
		state: {
			pathname: "*",
			title: "notFoundTitle",
		},
	},
];

export default routes;
