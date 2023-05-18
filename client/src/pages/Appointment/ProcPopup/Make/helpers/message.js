/* eslint-disable react/jsx-filename-extension */

import Notification from "@/components/UI/Form/Notification/Notification.jsx";

class Message {
	array = [
		{
			condition: (object) => object.availableTypes.length < object.types.length
            && object.availableTypes.length > 0,
			component: () => (
				<Notification
					content={{
						key: "notFullAccessProceduresWarning",
					}}
					status="warning"
				/>
			),
			status: "warning",
		},
		{
			condition: (object) => !object.availableTypes.length,
			component: () => (
				<Notification
					content={{
						key: "noAccessProceduresError",
					}}
					status="error"
				/>
			),
			status: "error",
		},
	];

	check(state) {
		return this.array.find((object) => object.condition(state) && object.component) || {};
	}
}

export default new Message();