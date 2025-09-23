export interface OAuthProfile {
  provider: 'GOOGLE' | 'GITHUB';
  providerId: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface OAuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  provider?: 'GOOGLE' | 'GITHUB' | 'EMAIL';
  providerId?: string;
  emailVerified: boolean;
}

export interface OAuthTokens {
  accessToken: string;
  refreshToken: string;
}