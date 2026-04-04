import type { Model } from "mongoose";
import { model, models, Schema } from "mongoose";

export enum UserRole {
  USER = 'user',
  PROVIDER = 'provider',
  ADMIN = 'admin'
}

export interface IUser {
  id?: string;
  name: string;
  email: string;
  password_hash: string;
  image_url?: string;
  role: UserRole;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  image_url: { type: String, default: null },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
}, { timestamps: true });

userSchema.virtual('id').get(function() { return this._id.toHexString(); });
userSchema.set('toJSON', { virtuals: true });

// Check if model exists; otherwise, create it
const UserModel: Model<IUser> =
  models.User || model<IUser>("User", userSchema);

export default UserModel;