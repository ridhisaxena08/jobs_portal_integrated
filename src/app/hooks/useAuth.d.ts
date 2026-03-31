export interface User {
  role: string;
  [key: string]: any;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; message?: string }>;
  signup: (userData: any) => Promise<{ success: boolean; user?: User; message?: string }>;
  logout: () => void;
  updateUser: (userData: any) => void;
}

export declare const useAuth: () => AuthContextType;
export declare const AuthProvider: ({ children }: { children: React.ReactNode }) => JSX.Element;
export declare const ProtectedRoute: ({ children, requiredRole }: { 
  children: React.ReactNode; 
  requiredRole?: string | null 
}) => JSX.Element;
