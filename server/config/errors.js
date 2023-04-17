const errors = {
  inRange: (key, range) => ({
    key,
    args: {
      min: range.min,
      max: range.max,
    },
  }),
  larger: (key, min) => ({
    key,
    args: {
      min,
    },
  }),
  required: (key) => ({
    key,
  }),
  wrongFormat: (key) => ({
    key,
  }),
  notExist: (key) => ({
    key,
  }),
  alreadyExist: (key) => ({
    key,
  }),
  unauth: () => ({
    key: "unauthValid",
  }),
  noAccess: (text) => ({
    key: "noAccessValid",
    args: {
      text,
    },
  }),
  fullname: () => ({
    key: "fullnameValid",
  }),
  wrongSignin: () => ({
    key: "wrongSigninValid",
  }),
  wrongChannels: () => ({
    key: "wrongChannelsValid",
  }),
  timeOut: (actionName) => ({
    key: "timeOutValid",
    args: {
      actionName,
    },
  }),
  sentPassword: () => ({
    key: "sentPasswordValid",
  }),
  noAccessRequest: () => ({
    key: "noAccessRequestValid",
  }),
};

export default errors;