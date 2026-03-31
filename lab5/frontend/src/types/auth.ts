export type AuthenticatedUser = {
  id: number;
  full_name: string;
  email: string;
  role: string;
  is_active: boolean;
};

export type SignInPayload = {
  email: string;
  password: string;
};

export type SignUpPayload = {
  full_name: string;
  email: string;
  password: string;
};

export type AuthSession = {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: AuthenticatedUser;
};

export type RoleSummary = {
  id: number;
  name: string;
};

export type UserResponse = {
  id: number;
  full_name: string;
  email: string;
  is_active: boolean;
  role: RoleSummary;
  created_at: string;
  updated_at: string;
};
