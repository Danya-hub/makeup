const errors = {
	inRangeValid: "{{field}} should be in the range from {{min}} to {{max}}",
	largerValid: "{{field}} should be larger than {{min}}",
	requiredFullnameValid: "Fullname is required",
	requiredTelephoneValid: "Telephone is required",
	requiredTelOrEmailValid: "Telephone or email is required",
	requiredEmailValid: "Email is required",
	requiredPasswordValid: "Password is required",
	wrongTelFormatValid: "Wrong telephone format",
	wrongEmailFormatValid: "Wrong email format",
	notExistUserValid: "This user does not exists",
	alreadyExistValid: "{{field}} already exists",
	unauthValid: "You are not unauthorized!",
	fullnameValid: "Only upper or lower case letters and one space are available for username",
	wrongSigninValid: "Email address, telephone or password is wrong",
	wrongChannelsValid: "Email address, telephone has wrong format",
	timeOutValid: "Time is over for {{actionName}}",
	sentPasswordValid: "Message already is submitted",
	noAccessRequestValid: "You do not have access",
	baseUserInfoAlreadyExistsValid: "Phone or name is already registered",
};

export default errors;