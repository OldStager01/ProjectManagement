import User from "../models/user.model.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const register = asyncWrapper(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email });

  if (user) {
    throw new ApiError(409, "Email already exists");
  }

  const newUser = await User.create({
    name,
    email,
    password,
  });

  //Check if user is created and remove password field if the user exists from the user object.
  const createdUser = await User.findById(newUser._id).select("-password");
  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }
  const token = jwt.sign({ ...createdUser }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });

  createdUser.token = token;

  res.status(201).json(
    new ApiResponse(201, {
      user: createdUser,
      message: "User created successfully",
    }),
  );
});

export { register };
