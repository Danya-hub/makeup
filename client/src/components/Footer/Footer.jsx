import { memo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Logo from "@/components/UI/Logo/Logo.jsx";
import CommMethods from "@/components/UI/CommMethods/CommMethods.jsx";

import "./Footer.module.css";

function Footer() {
	const { t } = useTranslation();

	return (
		<footer>
			<Logo />
			<nav>
				<ul>
					<li>
						<Link
							to="/%23bestWorks"
						>
							{t("bestWorks")}
						</Link>
					</li>
					<li>
						<Link
							to="/%23myServices"
						>
							{t("myServices")}
						</Link>
					</li>
				</ul>
			</nav>
			<CommMethods />
			<Link
				to="/appointment"
				className="button border"
			>
				{t("book")}
			</Link>
		</footer>
	);
}

export default memo(Footer);