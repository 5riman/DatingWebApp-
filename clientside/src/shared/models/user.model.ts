export interface User {
  id: string;
  email: string;
  displayName: string;
  imageUrl?: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  displayName: string;
  email: string;
  password: string;
}
