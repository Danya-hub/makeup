import PermanentMakeupRu from "@/assets/docs/permanent_makeup_ru.pdf";

const docs = {
	1: [
		PermanentMakeupRu,
		{
			day: (object) => object.createdAt.getDate(),
			month: (object) => object.createdAt.getMonth(),
			year: (object) => object.createdAt.getFullYear(),
			fullname: (object) => object.user.fullname,
			yearsOld: (object) => {
				const today = new Date();
				const dateOfBirthday = object.user.birthday;

				return today.getFullYear() - dateOfBirthday.getFullYear();
			},
			telephone: (object) => object.user.telephone,
		}],
};

export default docs;