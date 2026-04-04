import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosInstance";
import { FetchProvider } from "@/types/Provider";

export const useProviders = () => {
  return useQuery({
    queryKey: ["providers"],
    queryFn: async () => {
      const { data } = await api.get("/providers");

      return data.providers.map((p: FetchProvider) => ({
        id: p.id,
        name: p.name || "Unknown Provider",
        image: p.image,
        category: p.category,
        rating: p.rating || 5.0,
        price: p.price || 300,
        bio: p.bio,
      }));
    },
  });
};

export const useGetProviderById = (id: string) => {
  return useQuery({
    queryKey: ["provider", id],
    queryFn: async () => {
      const { data } = await api.get(`/providers/${id}`);
      const p: FetchProvider = data.provider;
      return {
        id: p.id,
        name: p.name || "Unknown Provider",
        image: p.image,
        category: p.category,
        rating: p.rating || 5.0,
        bio: p.bio,
        price: p.price,
        availableSlots: p.availableSlots,
      };
    },
    enabled: !!id,
    staleTime: Infinity,
  });
};

// Fetch only available slots for a specific date
export const useGetAvailableSlots = (id: string, date: string) => {
  return useQuery({
    queryKey: ["slots", id, date],
    queryFn: async () => {
      const { data } = await api.get(`/providers/${id}/slots`, {
        params: { date }
      });
      return data.availableSlots;
    },
    enabled: !!id && !!date,
  });
};


export const useCategories = () => {
  return useQuery<string[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/providers/categories");
      return data.categories;
    },
  });
};
