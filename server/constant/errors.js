export default {
    inRange: (field, range) => `${field} should be in the range from ${range.min} to ${range.max}`,
    larger: (field, min) => `${field} should be larger than ${min}`,
    required: (field) => `${field} is required`,
    wrongFormat: (field) => `Wrong ${field} format`,
    notExist: (field) => `This ${field} does not exists`,
    alreadyExist: (field) => `${field} already exists`,
    unauth: () => `You are not unauthorized!`,
    noAccess: (text) => text || `You do not have access`,
    fullnameNotValid: () => `Only upper or lower case letters and one space are available for username`,
    wrongSignin: () => `Email address / telephone or password is wrong`,
    wrongChannels: () => `Email address / telephone has wrong format`
}