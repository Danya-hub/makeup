"use strict";

import ApiError from "../utils/apiError.js";

function errorsGather(err, req, res, next) {
    if (err instanceof ApiError) {
        return res.status(err.status).json(err.errors);
    }
    
    console.log(err);

    res.status(500).json(err.errors);

    next();
}

export {
    errorsGather as default,
}