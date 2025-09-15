export const jwtConfig = {
  secret: process.env.JWT_SECRET!,
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshSecret: process.env.REFRESH_TOKEN_SECRET!,
  refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
};