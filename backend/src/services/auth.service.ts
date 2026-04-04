import bcrypt from "bcryptjs";
import UserModel from "../models/User";

export const findUserByEmail = async (email: string) => {
  return await UserModel.findOne({ email });
};

export const fetchUserById = async (id: string) => {
  return await UserModel.findById(id).select("-password_hash");
};

export const createUser = async (userData: {
  name: string;
  email: string;
  pass: string;
}) => {
  const hashedPass = await bcrypt.hash(userData.pass, 10);

  const newUser = new UserModel({
    name: userData.name,
    email: userData.email,
    password_hash: hashedPass,
    role: "user"
  });

  return await newUser.save();
};

export const findUserWithPassword = async (id: string) => {
  return await UserModel.findById(id);
};
