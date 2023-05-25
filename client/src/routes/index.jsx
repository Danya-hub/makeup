import { lazy } from "react";

import HMFLayout from "@/components/Layouts/HMFLayout/HMFLayout.jsx";
import HMLayout from "@/components/Layouts/HMLayout/HMLayout.jsx";

const Base = lazy(() => import("@/pages/Base/Base.jsx"));
const Appointment = lazy(() => import("@/pages/Appointment/Appointment.jsx"));
const NotFound = lazy(() => import("@/pages/Error/NotFound/NotFound.jsx"));
const Signup = lazy(() => import("@/pages/Auth/Signup/Signup.jsx"));
const Signin = lazy(() => import("@/pages/Auth/Signin/Signin.jsx"));
const ResetPassword = lazy(() => import("@/pages/Auth/ResetPassword/ResetPassword.jsx"));
const UserProcedures = lazy(() => import("@/pages/UserProcedures/UserProcedures.jsx"));
const AboutProcedure = lazy(() => import("@/pages/ProcDetails/About/About.jsx"));
const ProcReviews = lazy(() => import("@/pages/ProcDetails/Reviews/Reviews.jsx"));

const routes = [
	{
		url: "/",
		elem: () => (
			<HMFLayout>
				<Base />
			</HMFLayout>
		),
	},
	{
		url: "/:section",
		elem: () => (
			<HMFLayout>
				<Base />
			</HMFLayout>
		),
	},
	{
		url: "/appointment",
		elem: () => (
			<HMLayout>
				<Appointment />
			</HMLayout>
		),
	},
	{
		url: "/signup",
		elem: () => (
			<HMLayout>
				<Signup />
			</HMLayout>
		),
	},
	{
		url: "/signin",
		elem: () => (
			<HMLayout>
				<Signin />
			</HMLayout>
		),
	},
	{
		url: "/myprocedures",
		elem: () => (
			<HMFLayout>
				<UserProcedures />
			</HMFLayout>
		),
	},
	{
		url: "/resetPassword",
		elem: () => (
			<HMLayout>
				<ResetPassword />
			</HMLayout>
		),
	},
	{
		url: "/details/:id",
		elem: () => (
			<HMFLayout>
				<AboutProcedure />
			</HMFLayout>
		),
	},
	{
		url: "details/reviews/:id",
		elem: () => (
			<HMLayout>
				<ProcReviews />
			</HMLayout>
		),
	},
	{
		url: "/notFound",
		elem: () => (
			<HMLayout>
				<NotFound />
			</HMLayout>
		),
	},
];

export default routes;
