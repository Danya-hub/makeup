import ApiError from "../utils/apiError.js";

function errorsGather(err, req, res, next) {
  console.log(err);

  if (err instanceof ApiError) {
    res.status(err.status).json(err.errors);
    return;
  }

  res.status(500).json(err.errors);

  next();
}

export default errorsGather;
