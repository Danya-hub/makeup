const errors = {
	inRangeValid: "{{field}} должен быть в пределах от {{min}} до {{max}}",
	largerValid: "{{field}} должно быть больше, чем {{min}}",
	requiredFullnameValid: "Требуется имя пользователя",
	requiredTelephoneValid: "Требуется телефон",
	requiredTelOrEmailValid: "Требуется телефон или электронная почта",
	requiredEmailValid: "Требуется электронная почта",
	requiredPasswordValid: "Требуется пароль",
	wrongTelFormatValid: "Неправильный формат номера телефона",
	wrongEmailFormatValid: "Неправильный формат электронной почты",
	notExistUserValid: "Этого пользователя не существует",
	alreadyExistValid: "{{field}} уже существует",
	unauthValid: "Вы не авторизованы!",
	fullnameValid: "Для имени пользователя доступны только буквы верхнего или нижнего регистра и один пробел",
	wrongSigninValid: "Адрес электронной почты, телефон или пароль неверен",
	wrongChannelsValid: "Адрес электронной почты, телефон имеет неверный формат",
	timeOutValid: "Время вышло для {{actionName}}",
	sentPasswordValid: "Сообщение уже отправлено",
	noAccessRequestValid: "У вас нет доступа",
	baseUserInfoAlreadyExistsValid: "Телефон или имя уже зарегестрировано",
};

export default errors;