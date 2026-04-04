import ProviderModel from "../models/Provider";

export const fetchAllProviders = async () => {
  return await ProviderModel.find();
};

export const fetchProviderById = async (id: string) => {
  return await ProviderModel.findById(id);
};

// Useful for the seed script or admin dashboard
export const createProvider = async (providerData: any) => {
  return await ProviderModel.create(providerData);
};
