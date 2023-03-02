import { useLocation } from "react-router-dom";

function ProcDetails() {
	const { state } = useLocation();

	// console.log(state.procedure);

	return <span>123</span>;
}

export default ProcDetails;
