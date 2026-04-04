export enum UserRole {
  USER = "user",
  PROVIDER = "provider",
  ADMIN = "admin",
}

export interface IUser {
  id?: string;
  name: string;
  email: string;
  image_url?: string;
  role?: UserRole;
}

export interface LoginData extends Pick<IUser, "email"> {
  pass: string;
}

export interface RegisterData extends LoginData {
  name: string;
  confPass: string;
}

export type UserProfile = Omit<IUser, "id" | "role">;
