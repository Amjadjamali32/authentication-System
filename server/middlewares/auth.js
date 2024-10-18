import { ApiError } from "../utilities/ApiError.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";  

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
            const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

            if (!token) {
                throw new ApiError(401, "Unauthorized Access!");
            }

            const decodedTokenInfo = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            const user = await User.findById(decodedTokenInfo?._id).select(
            "-password -refreshToken"
            );

            if (!user) {
                throw new ApiError(401, "Invalid access Token!");
            }

            req.user = user;
            next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access Token!");
    }
});

export default verifyJWT