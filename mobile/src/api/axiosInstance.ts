import axios from "axios";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import * as Application from "expo-application";
import * as Network from "expo-network";
import { getToken } from "../services/storageService";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_API!,
});

api.interceptors.request.use(
  async (config) => {
    // Get JWT Auth Token
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Get Device Identity & IP
    const rawDeviceId = Platform.OS === 'android' 
      ? Application.getAndroidId() 
      : await Application.getIosIdForVendorAsync();

    const deviceId = String(rawDeviceId || "unknown-device");
    const ipAddress = (await Network.getIpAddressAsync()) || "0.0.0.0";

    // Set Identity Headers
    config.headers["X-Requested-With"] = "EcoTechMobile";
    config.headers["X-Device-ID"] = deviceId;
    config.headers["X-Device-IP"] = ipAddress;

    // Get CSRF Token from local storage
    let csrfToken = await SecureStore.getItemAsync("csrf_token");

    if (!csrfToken && !config.url?.includes("/csrf-token")) {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_BASE_API}/auth/csrf-token`,
        {
          headers: {
            "X-Requested-With": "EcoTechMobile",
            "X-Device-ID": deviceId,
          },
        },
      );
      csrfToken = response.data.csrfToken;
      await SecureStore.setItemAsync("csrf_token", csrfToken!);
    }

    if (csrfToken) {
      config.headers["X-XSRF-TOKEN"] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 403) {
      await SecureStore.deleteItemAsync("csrf_token");
    }
    return Promise.reject(error);
  },
);

export default api;
