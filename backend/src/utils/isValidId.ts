import mongoose from "mongoose";

export const isValidId = (rawId: string) => {
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  if (!id || !mongoose.isValidObjectId(id)) {
    return false;
  }
  return true;
};
