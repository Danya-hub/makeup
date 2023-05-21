import types from "prop-types";

import Header from "@/components/Header/Header.jsx";
import Footer from "@/components/Footer/Footer.jsx";

function HMFLayout({
	children,
}) {
	return (
		<>
			<Header />
			{children}
			<Footer />
		</>
	);
}

HMFLayout.propTypes = {
	children: types.node.isRequired,
};

export default HMFLayout;