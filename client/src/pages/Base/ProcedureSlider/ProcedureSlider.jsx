import types from "prop-types";

import Output from "./Output/Output.jsx";
import Empty from "./Empty/Empty.jsx";

function ProcedureSlider({
	procedures,
}) {
	return (
		procedures.length ? (
			<Output
				procedures={procedures}
			/>
		) : <Empty />
	);
}

ProcedureSlider.propTypes = {
	procedures: types.instanceOf(Array).isRequired,
};

export default ProcedureSlider;