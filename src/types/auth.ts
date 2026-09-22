export interface WebUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
  createdAt: string;
}

export interface AuthState {
  user: WebUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
