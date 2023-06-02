import { UserRole } from './user';

export interface VerifyEmailBody {
  email: string;
}

export interface VerifyEmailResponse {
  id: number;
  name: string;
  code: string;
  domain: string;
  active: boolean;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: { eduMail: string; role: UserRole };
  workspaceDomain: string;
}

export interface LogoutBody {
  username: string;
}
