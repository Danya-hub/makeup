export const server = {
  origin: "http://localhost:3000",
  port: 3001,
};

export const request = {
  windowMs: 60 * 1000,
  max: 100,
  message: {
    error: {
      key: "manyRequestsValid",
      args: {
        delay: 1,
      },
    },
  },
};