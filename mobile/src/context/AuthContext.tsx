import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { getToken, saveToken, removeToken } from "../services/storageService";
import { IUser } from "@/types/User";
import api from "@/api/axiosInstance";

// Define the shape of the Context
interface AuthContextType {
  userToken: string | null;
  user: IUser | null;
  isLoading: boolean;
  onLoginSuccess: (data: { token: string; user: IUser }) => Promise<void>;
  onLogoutSuccess: () => Promise<void>;
}

// Create the context with an initial undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
  const initializeAuth = async () => {
    try {
      const token = await getToken();
      if (token) {
        setUserToken(token);
        const response = await api.get("/auth/me"); 

        if (response.data.user) {
          setUser(response.data.user);
        }
      }
    } catch (e) {
      console.error("Session expired or network error", e);
      // await logout(); 
    } finally {
      setIsLoading(false);
    }
  };
  initializeAuth();
}, []);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await getToken();
        setUserToken(token);
      } catch (e) {
        console.error("Failed to load token", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  const onLoginSuccess = async (data: { token: string; user: IUser }) => {
    await saveToken(data.token);
    setUserToken(data.token);
    setUser(data.user);
  };

  const onLogoutSuccess = async () => {
    await removeToken();
    setUserToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ userToken, user, isLoading, onLoginSuccess, onLogoutSuccess }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook with type safety
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
