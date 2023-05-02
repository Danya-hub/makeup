import MakeProc from "./Make/Make.jsx";
import DesignProc from "./Design/Design.jsx";
import EditProc from "./Edit/Edit.jsx";

const popups = {
	design: () => <DesignProc />,
	make: () => <MakeProc />,
	edit: () => <EditProc />,
};

export default popups;