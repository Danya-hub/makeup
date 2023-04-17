/* eslint-disable react/jsx-filename-extension */

import Notification from "@/components/UI/Form/Notification/Notification.jsx";

import ProcConfig from "@/config/procedures.js";

class Message {
	array = [
		{
			condition: (object) => object.availableTypes.length < object.types.length
            && object.availableTypes.length > 0,
			component: <Notification
				content={{
					key: "notFullAccessProceduresWarning",
				}}
				status="warning"
			/>,
			status: "warning",
		},
		// {
		// 	condition: (object) => ProcConfig.MAX_COUNT_PROCEDURE <= object.newProcedures.length,
		// 	component: <Notification
		// 		content={{
		// 			key: "increasedCountProceduresError",
		// 		}}
		// 		status="error"
		// 	/>,
		// 	status: "error",
		// },
		{
			condition: (object) => !object.availableTypes.length,
			component: <Notification
				content={{
					key: "noAccessProceduresError",
				}}
				status="error"
			/>,
			status: "error",
		},
	];

	check(state) {
		return this.array.find((object) => object.condition(state) && object.component) || {};
	}
}

export default new Message();