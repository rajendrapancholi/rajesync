import UserModel from "../models/User";


export const findUserByEmail = async (email: string) => {
  return await UserModel.findOne({ email });
};

export const findUserById = async (id: string) => {
  return await UserModel.findOne({ _id: id });
};