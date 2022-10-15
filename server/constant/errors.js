export default {
    inRange: (field, range) => `${field} should be in the range from ${range.min} to ${range.max}`,
    larger: (field, min) => `${field} should be larger than ${min}`,
    required: (field) => `${field} is required`,
    wrong: (field) => `Wrong ${field}`,
    notExist: (field) => `This ${field} does not exist`,
    alreadyExist: (field) => `This ${field} already exist`,
    unrecognizedSignin: () => `Unrecognized name or password`,
    unauth: () => `You are not Authorization!`,
    noAccess: () => `You do not have access`,
}