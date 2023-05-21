import types from "prop-types";

import Header from "@/components/Header/Header.jsx";

function HMLayout({
	children,
}) {
	return (
		<>
			<Header />
			{children}
		</>
	);
}

HMLayout.propTypes = {
	children: types.node.isRequired,
};

export default HMLayout;