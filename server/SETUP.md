# VisualDocs Backend - Complete Setup Guide

## 🚀 Quick Start Checklist

### 1. **Database Setup (REQUIRED)**
```bash
# Install PostgreSQL if not already installed
# Windows: Download from https://www.postgresql.org/download/windows/
# macOS: brew install postgresql
# Linux: sudo apt-get install postgresql

# Create database
psql -U postgres
CREATE DATABASE visualdocs_db;
\q

# Update your .env file
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/visualdocs_db"
```

### 2. **Environment Configuration (REQUIRED)**
```bash
# Copy the example environment file
cp .env.example .env

# Generate secure JWT secrets (run in terminal)
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('REFRESH_TOKEN_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"

# Copy the generated secrets to your .env file
```

### 3. **AI Integration Setup (REQUIRED)**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env` file:
```
GEMINI_API_KEY=your-actual-gemini-api-key-here
```

### 4. **Database Migration (REQUIRED)**
```bash
# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

### 5. **Start the Server**
```bash
npm run dev
```
Visit: http://localhost:3004/health (should return "OK")

---

## 🔧 Optional Configurations

### GitHub Integration (For Repository Import)
1. Go to [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes:
   - `public_repo` (for public repositories only)
   - `repo` (for private repositories access)
4. Generate token and add to `.env`:
```
GITHUB_TOKEN=ghp_your-actual-github-token-here
```

**Benefits:**
- Increases API rate limit from 60/hour to 5,000/hour
- Enables repository import feature
- Access to private repositories (if token has permissions)

### OAuth Social Login

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `http://localhost:3004/api/oauth/google/callback` (development)
   - `https://yourdomain.com/api/oauth/google/callback` (production)
6. Copy credentials to `.env`:
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### GitHub OAuth Setup
1. Go to [GitHub Settings > Developer Settings](https://github.com/settings/developers)
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in details:
   - Authorization callback URL: `http://localhost:3004/api/oauth/github/callback`
4. Copy credentials to `.env`:
```
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

---

## 📝 Environment Variables Explained

### Critical Variables (App won't start without these)
| Variable | Purpose | How to Get |
|----------|---------|------------|
| `DATABASE_URL` | PostgreSQL connection string | Set up PostgreSQL database |
| `JWT_SECRET` | Signs JWT tokens | Generate random 32+ character string |
| `REFRESH_TOKEN_SECRET` | Signs refresh tokens | Generate random 32+ character string |
| `GEMINI_API_KEY` | AI diagram generation | Get from Google AI Studio |

### Server Configuration
| Variable | Default | Purpose |
|----------|---------|---------|
| `NODE_ENV` | development | Application environment |
| `PORT` | 3004 | Server port |
| `BASE_URL` | http://localhost:3004 | Backend URL for callbacks |
| `CLIENT_URL` | http://localhost:3005 | Frontend URL for CORS |

### Optional Features
| Variable | Purpose | Required For |
|----------|---------|--------------|
| `GITHUB_TOKEN` | GitHub API access | Repository import |
| `GOOGLE_CLIENT_ID/SECRET` | Google OAuth | Social login |
| `GITHUB_CLIENT_ID/SECRET` | GitHub OAuth | Social login |

---

## 🎯 Backend Capabilities Summary

Your VisualDocs backend can:

### 📊 **Project Documentation Generation**
- **Automatic Code Analysis**: Scans uploaded files and generates comprehensive documentation
- **AI-Powered Insights**: Uses Google Gemini to analyze code structure and relationships
- **Interactive Diagrams**: Generates entity relationship diagrams, component diagrams, and flow charts
- **Multiple Export Formats**: JSON, CSV, PDF exports of documentation

### 🐙 **GitHub Integration**
- **Repository Import**: Import entire GitHub repositories with smart file filtering
- **Framework Detection**: Automatically detects React, Node.js, Python, and other frameworks
- **Batch Processing**: Handles large repositories efficiently with rate limiting
- **Metadata Extraction**: Captures repository information, commit history, and file structure

### 👥 **User Management**
- **JWT Authentication**: Secure token-based authentication
- **OAuth Integration**: Login with Google and GitHub
- **Role-Based Access**: Support for different user permissions
- **Session Management**: Refresh token support for seamless experience

### 📁 **File Management**
- **Smart Upload**: Handles multiple file formats with validation
- **Project Organization**: Groups files by projects with tagging
- **Version Control**: Tracks file changes and updates
- **Bulk Operations**: Import, export, and manage files in batches

### 🔄 **Real-Time Features**
- **Live Progress Updates**: Socket.IO integration for import progress
- **Collaborative Editing**: Real-time updates when multiple users work on projects
- **Notification System**: Real-time alerts for completed operations

---

## 🚨 Production Deployment Notes

### Security Checklist
- [ ] Change all default JWT secrets
- [ ] Use strong database passwords
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS
- [ ] Secure API keys
- [ ] Configure proper CORS origins

### Performance Optimization
- [ ] Set up database connection pooling
- [ ] Configure Redis for session storage (optional)
- [ ] Set up file storage (AWS S3, etc.)
- [ ] Configure monitoring (Sentry, etc.)

### Environment Variables for Production
```bash
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@production-db:5432/visualdocs"
BASE_URL=https://api.yourdomain.com
CLIENT_URL=https://yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com
```

---

## 🐛 Troubleshooting

### Common Issues

**"Cannot connect to database"**
- Check PostgreSQL is running
- Verify DATABASE_URL credentials
- Ensure database exists

**"Invalid JWT secret"**
- JWT secrets must be at least 32 characters
- Use strong, random strings
- Never use example values in production

**"Gemini API quota exceeded"**
- Check your Google AI Studio quota
- Monitor API usage
- Consider implementing caching for repeated analyses

**"GitHub rate limit exceeded"**
- Add GITHUB_TOKEN to increase limits
- Implement proper rate limiting in your app
- Consider caching repository data

### Getting Help
- Check logs: `npm run dev` shows detailed error messages
- Database issues: Use `npx prisma studio` to inspect data
- API testing: Use Postman or similar to test endpoints
- GitHub issues: Check the repository for known issues and solutions

---

## 📖 API Documentation

Once your server is running, you can access:
- Health check: `http://localhost:3004/health`
- API docs: `http://localhost:3004/api/docs` (if Swagger is configured)
- Database browser: `npx prisma studio`

Your backend is now ready to handle project documentation, GitHub integration, and user management! 🎉