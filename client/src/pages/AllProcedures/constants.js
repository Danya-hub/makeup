import MakeProc from "./ProcPopup/Make/Make.jsx";
import DesignProc from "./ProcPopup/Design/Design.jsx";
import EditProc from "./ProcPopup/Edit/Edit.jsx";

export const DEFAULT_POPUP_NAME = "make";
export const MAX_COUNT_PROCEDURE = 3;
export const PAYMENT_METHODS = ["spot", "bankCard"];
export const COLUMN_NAMES = ["time", "status", "procedureName"];
export const POPUP_COMPONENTS = {
	design: () => <DesignProc />,
	make: () => <MakeProc />,
	edit: () => <EditProc />,
};
