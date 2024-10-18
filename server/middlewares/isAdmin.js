import { ApiError } from '../utilities/ApiError.js';

export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'Admin') {
        return next(new ApiError(403, "Access denied. Admins only!"));
    }
    next();
};
