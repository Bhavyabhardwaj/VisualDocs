# OAuth Authentication Implementation

This document outlines the OAuth authentication implementation for Google and GitHub in the VisualDocs application.

## Features

- **Google OAuth 2.0** authentication
- **GitHub OAuth** authentication
- **Account linking** for existing email accounts
- **JWT-based** session management
- **Secure token handling** with HTTP-only cookies
- **Automatic user creation** for new OAuth users

## Setup Instructions

### 1. Environment Variables

Add the following variables to your `.env` file:

```bash
# Base URL for your application
BASE_URL=http://localhost:3004

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Frontend URL for redirects
CLIENT_URL=http://localhost:3005
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `http://localhost:3004/api/auth/google/callback` (development)
   - `https://your-domain.com/api/auth/google/callback` (production)

### 3. GitHub OAuth Setup

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL:
   - `http://localhost:3004/api/auth/github/callback` (development)
   - `https://your-domain.com/api/auth/github/callback` (production)

### 4. Database Migration

Run the Prisma migration to update your database schema:

```bash
npx prisma migrate dev --name add-oauth-support
npx prisma generate
```

## API Endpoints

### OAuth Authentication

#### Google OAuth
- **GET** `/api/auth/google` - Initiate Google OAuth
- **GET** `/api/auth/google/callback` - Google OAuth callback

#### GitHub OAuth
- **GET** `/api/auth/github` - Initiate GitHub OAuth
- **GET** `/api/auth/github/callback` - GitHub OAuth callback

## Frontend Integration

### Login Buttons

```javascript
// Google OAuth login
const loginWithGoogle = () => {
  window.location.href = `${API_BASE_URL}/api/auth/google`;
};

// GitHub OAuth login
const loginWithGitHub = () => {
  window.location.href = `${API_BASE_URL}/api/auth/github`;
};
```

### Handle OAuth Callback

The OAuth callback will redirect to your frontend with user data:

```javascript
// Handle OAuth callback on frontend
const handleOAuthCallback = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const userData = urlParams.get('user');
  
  if (token && userData) {
    // Store token in localStorage or secure storage
    localStorage.setItem('accessToken', token);
    
    // Parse user data
    const user = JSON.parse(decodeURIComponent(userData));
    
    // Update your app state
    setUser(user);
    setIsAuthenticated(true);
    
    // Redirect to dashboard
    navigate('/dashboard');
  }
};
```

## Database Schema

The User model has been updated to support OAuth:

```prisma
model User {
  id            String        @id @default(uuid())
  email         String        @unique
  name          String
  password      String?       // Optional for OAuth users
  avatar        String?
  role          Role          @default(USER)
  isActive      Boolean       @default(true)
  emailVerified Boolean       @default(false)
  lastLoginAt   DateTime?
  
  // OAuth fields
  provider      AuthProvider? // GOOGLE, GITHUB, EMAIL
  providerId    String?       // OAuth provider user ID
  accessToken   String?       // OAuth access token (encrypted)
  refreshToken  String?       // OAuth refresh token (encrypted)
  
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  // Relationships
  projects      Project[]
  sessions      Session[]
  
  @@index([providerId])
  @@map("users")
}

enum AuthProvider {
  EMAIL
  GOOGLE
  GITHUB
}
```

## Security Features

### 1. Account Linking
- If a user signs up with OAuth using an email that already exists, the OAuth account is linked to the existing account
- Prevents duplicate accounts for the same email address

### 2. Token Security
- Refresh tokens are stored in HTTP-only cookies
- Access tokens are returned in the redirect URL for frontend storage
- All tokens are signed with secure secrets

### 3. Input Validation
- OAuth profile data is validated before user creation
- Email addresses are verified through OAuth providers
- Required fields are enforced

### 4. Error Handling
- Comprehensive error handling for OAuth failures
- User-friendly error messages
- Logging for debugging OAuth issues

## Testing OAuth Integration

### Development Testing

1. Start your development server
2. Navigate to `/api/auth/google` or `/api/auth/github`
3. Complete OAuth flow
4. Verify user creation in database
5. Check token storage and session management

### Production Considerations

1. **HTTPS Required**: OAuth providers require HTTPS in production
2. **Environment Variables**: Ensure all OAuth credentials are properly set
3. **CORS Configuration**: Configure CORS for your frontend domain
4. **Rate Limiting**: OAuth endpoints are protected with rate limiting
5. **Monitoring**: Monitor OAuth success/failure rates

## Troubleshooting

### Common Issues

1. **Invalid Redirect URI**: Ensure callback URLs match exactly in OAuth provider settings
2. **Missing Environment Variables**: Check all required OAuth credentials are set
3. **CORS Errors**: Configure CORS to allow your frontend domain
4. **Database Connection**: Ensure database is accessible for user creation

### Debug Logging

OAuth operations are logged with appropriate levels:

```javascript
// View OAuth logs
tail -f logs/app.log | grep "OAuth"
```

## Security Recommendations

1. **Rotate Secrets Regularly**: Change OAuth client secrets periodically
2. **Monitor Failed Attempts**: Set up alerts for OAuth failures
3. **Validate Redirect URIs**: Keep redirect URI lists minimal and specific
4. **Use HTTPS**: Always use HTTPS in production
5. **Secure Token Storage**: Use secure storage mechanisms for tokens

## Future Enhancements

- **Microsoft OAuth** support
- **LinkedIn OAuth** support
- **Multi-factor authentication** for OAuth accounts
- **OAuth token refresh** automation
- **Advanced account linking** options