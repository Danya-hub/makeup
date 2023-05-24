import MakeProc from "@/pages/Appointment/ProcPopup/Make/Make.jsx";
import DesignProc from "@/pages/Appointment/ProcPopup/Design/Design.jsx";
import EditProc from "@/pages/Appointment/ProcPopup/Edit/Edit.jsx";

const popups = {
	design: () => <DesignProc />,
	make: () => <MakeProc />,
	edit: () => <EditProc />,
};

export default popups;