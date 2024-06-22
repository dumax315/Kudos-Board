// based on https://medium.com/@mohsinogen/simplified-guide-to-setting-up-a-global-error-handler-in-express-js-daf8dd640b69

import { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    try {
        console.error(err.stack);
        console.log(err);
        res.status(err.statusCode).json(err);
    } catch {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
