import { User } from "../models/user.model.js";
import { ApiError } from "../utilities/ApiError.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js"
import bcrypt from "bcrypt"
import { uploadOnCloudinary } from "../utilities/cloudinary.js"
import {v2 as cloudinary} from "cloudinary"
import crypto from "crypto";
import { sendPasswordResetEmail } from "../utilities/nodeMailer.js"

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        console.log("AccessToken: ", accessToken, " RefreshToken: ", refreshToken);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error generating tokens: ", error);  
        throw new ApiError(501, "Something went wrong while generating access and refresh token!");
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, profileImage, role, adminSecret } = req.body;
    console.log(req.body);

    // // check validation - non empty
    if ([name, email, password, profileImage, role, adminSecret].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required!");
    }

    const existedUser = await User.findOne({ email });
    
    if (existedUser) {
        throw new ApiError(409, "Username or email already exists!");
    }

    // // check for images , check for avatar
    const profileImageLocalPath = req.files?.profileImage?.[0]?.path;

    console.log(profileImageLocalPath);
    

    // // error in this field
    if (!profileImageLocalPath) {
        throw new ApiError(400, "Avatar is required!");
    }

    // // upload them to cloudinary, avatar
    const profile = await uploadOnCloudinary(profileImageLocalPath);

    // console.log(profile);
    

    if (!profile) {
        throw new ApiError(400, "Profile Image file upload failed!");
    }

    // create user object - create entry in db
    const user = await User.create({
        name,
        profileImage: profile.url,
        email,
        password,
        adminSecret,
        role
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong in user creation!");
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User Registered Successfully")
    );
});

const login = asyncHandler(async (req , res) => {
    const { email , password , adminSecret } = req.body;

    // Check required fields
    if (!email || !password) {
        throw new ApiError(401, "Email or Password is missing!");
    }

    const user = await User.findOne({ email });

    console.log(user);

    if (!user) {
        throw new ApiError(404, "User not found!");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Incorrect Password!");
    }

    if (user.role === "admin") {
        if (!adminSecret) {
            throw new ApiError(403, "Admin Secret is required for admin login!");
        }

        console.log(adminSecret);
        
        // Match the adminSecret from the request with the one in the environment
        if (adminSecret !== process.env.ADMIN_SECRET) {
            throw new ApiError(403, "Invalid Admin Secret!");
        }
    }

    const { accessToken , refreshToken } = await generateAccessAndRefreshToken(user._id);
    
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = { httpOnly: true, secure: true };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in successfully"
            )
        );
});

const getCurrentUser = asyncHandler(async (req, res) => {
    const currentUser = req.user.toObject(); 
    delete currentUser.adminSecret;

    console.log(currentUser);
    
    return res
    .status(200)
    .json(new ApiResponse(200 , currentUser , "Current user fetched Successfully"));
});

const logout = asyncHandler(async (req, res) => {
    const options = { httpOnly: true, secure: true };

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 
            }
        },
        {
            new: true
        }
    );

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out!"));
});

const changePassword = asyncHandler(async (req, res) => {
    const { id } = req.params;  // Assuming `id` is the user ID
    const { currentPassword, newPassword } = req.body;

    // Check for required fields
    if (!currentPassword || !newPassword) {
        throw new ApiError(400, "Both current and new passwords are required!");
    }

    // Find the user by their ID
    const user = await User.findById(id);
    

    if (!user) {
        throw new ApiError(404, "User not found!");
    }

    // Verify the current password
    const isPasswordValid = await user.isPasswordCorrect(currentPassword);  
    console.log(isPasswordValid);


    if (!isPasswordValid) {
        throw new ApiError(401, "Current password is incorrect!");
    }

    // Hash the new password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    return res
    .status(200)
    .json({ success: true, message: "Password changed successfully!" });
});

const updateProfile = asyncHandler(async (req, res) => {
    const { name, email } = req.body;
    const profileImageLocalPath = req.files?.profileImage?.[0]?.path;

    if (!name || !email) {
        throw new ApiError(402, "All fields are required!");
    }

    // Fetch the current user to get the old image
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    if (!user) {
        throw new ApiError(404, "User not found!");
    }

    // Check if there is a previous image and delete it from Cloudinary
    if (user.profileImage && profileImageLocalPath) {
        const publicId = user.profileImage.split('/').pop().split('.')[0]; 
        await cloudinary.uploader.destroy(publicId); 
    }

    // Upload the new image to Cloudinary if a new image is provided
    let uploadedImage;
    if (profileImageLocalPath) {
        uploadedImage = await uploadOnCloudinary(profileImageLocalPath);
        if (!uploadedImage) {
            throw new ApiError(500, "Error uploading new profile image to Cloudinary!");
        }
    }

    // Update user fields
    user.name = name;
    user.email = email;
    if (uploadedImage) {
        user.profileImage = uploadedImage.secure_url; 
    }

    // Save the updated user
    const updatedUser = await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "User profile updated successfully!"));
});

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            throw new ApiError(404, "User not found with this email!");
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // hashed token
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes

        await user.save();

        const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/reset-password/${resetToken}`;

        // Send the reset password email
        const emailSent = await sendPasswordResetEmail(user.email, resetUrl);        

        if(!emailSent) {
            throw new ApiError(401, "Email has not been sent!")
        }

        return res
            .status(200)
            .json(new ApiResponse(200, "Password reset link sent to your email"));
    } catch (err) {
        console.error("Error sending reset email:", err);
        throw new ApiError(401, 'Error sending reset email', err);
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    const resetToken = req.params.token;

    // Hash the token and compare it with the stored hashed token in the database
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Find the user with the matching reset token and check if it's still valid
    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() } // Check if the token is not expired
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired reset token!");
    }

    // Set new password
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
        throw new ApiError(400, "New password is required and must be at least 8 characters long!");
    }

    // Hash the new password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined; // Clear reset token
    user.resetPasswordExpire = undefined; // Clear expiration date

    await user.save();

    return res.status(200).json(new ApiResponse(200, "Password has been reset successfully!"));
});

const updatePassword = asyncHandler(async (req, res) => {
    const { password } = req.body;

    // Find the user by token and make sure token is valid
    const resetToken = req.params.token;
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        throw new ApiError(400, "Invalid or expired reset token.");
    }

    // Set new password and clear the reset token fields
    user.password = password; 
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password has been reset successfully!"
    });
});

export {
    registerUser,
    login,
    getCurrentUser,
    logout,
    changePassword,
    forgotPassword,
    updateProfile,
    resetPassword,
    updatePassword,
}
