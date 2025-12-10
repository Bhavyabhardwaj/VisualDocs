import { PremiumLayout } from '@/components/layout/PremiumLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Search, 
  BookOpen, 
  Code, 
  Lightbulb, 
  Rocket,
  CheckCircle2,
  Clock,
  Star,
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  BookMarked,
  Timer,
  ThumbsUp,
  Share2,
  Bookmark,
  X,
  Menu,
  Hash,
  ArrowUp,
  Sparkles
} from 'lucide-react';
import { useState, useMemo, useEffect, useCallback } from 'react';

// Documentation content for each article
const documentationContent: Record<string, {
  title: string;
  description: string;
  content: string;
  sections: { id: string; title: string; content: string }[];
  relatedDocs?: string[];
}> = {
  'installation-guide': {
    title: 'Installation Guide',
    description: 'Get VisualDocs up and running in minutes',
    content: 'This guide will walk you through the complete installation process for VisualDocs.',
    sections: [
      {
        id: 'prerequisites',
        title: 'Prerequisites',
        content: `Before installing VisualDocs, ensure you have the following:

• **Node.js** (v18 or higher) - [Download Node.js](https://nodejs.org)
• **npm** or **yarn** package manager
• **Git** for version control
• A modern web browser (Chrome, Firefox, Safari, or Edge)

You can verify your Node.js installation by running:
\`\`\`bash
node --version
npm --version
\`\`\``
      },
      {
        id: 'installation',
        title: 'Installation Steps',
        content: `**Step 1: Clone the Repository**
\`\`\`bash
git clone https://github.com/your-org/visualdocs.git
cd visualdocs
\`\`\`

**Step 2: Install Dependencies**
\`\`\`bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
\`\`\`

**Step 3: Configure Environment**
Create a \`.env\` file in both client and server directories:
\`\`\`bash
# Server .env
DATABASE_URL="your-database-url"
JWT_SECRET="your-secret-key"
OPENAI_API_KEY="your-openai-key"
\`\`\`

**Step 4: Start the Application**
\`\`\`bash
# Start the server
cd server
npm run dev

# In another terminal, start the client
cd client
npm run dev
\`\`\``
      },
      {
        id: 'verification',
        title: 'Verify Installation',
        content: `After starting both servers, verify your installation:

1. Open your browser and navigate to \`http://localhost:3000\`
2. You should see the VisualDocs landing page
3. Create an account or sign in
4. Navigate to the Dashboard to start using the platform

If you encounter any issues, check the console logs for error messages.`
      }
    ],
    relatedDocs: ['first-project-setup', 'configuration-basics']
  },
  'first-project-setup': {
    title: 'First Project Setup',
    description: 'Create and configure your first VisualDocs project',
    content: 'Learn how to create your first project and start generating documentation.',
    sections: [
      {
        id: 'create-project',
        title: 'Creating a New Project',
        content: `**Step 1: Navigate to Dashboard**
From the main dashboard, click the "New Project" button in the top right corner.

**Step 2: Choose Project Type**
Select your project type:
• **GitHub Repository** - Import from GitHub
• **Local Upload** - Upload files directly
• **ZIP Archive** - Upload a compressed project

**Step 3: Configure Project Settings**
- Enter a project name
- Add a description (optional)
- Choose visibility (public/private)
- Select analysis options`
      },
      {
        id: 'import-code',
        title: 'Importing Your Code',
        content: `**For GitHub Repositories:**
1. Connect your GitHub account if not already connected
2. Select the repository from the list
3. Choose the branch to analyze
4. Click "Import"

**For Local Uploads:**
1. Drag and drop files or click to browse
2. Supported formats: .js, .ts, .tsx, .jsx, .py, .java, and more
3. Maximum file size: 50MB per file
4. Click "Upload" to proceed`
      },
      {
        id: 'initial-analysis',
        title: 'Running Initial Analysis',
        content: `Once your code is imported, VisualDocs will automatically:

1. **Parse your codebase** - Identify files, functions, and structures
2. **Generate documentation** - Create initial documentation drafts
3. **Build diagrams** - Create visual representations of your code
4. **Analyze complexity** - Calculate metrics and identify issues

This process typically takes 1-5 minutes depending on project size.`
      }
    ],
    relatedDocs: ['installation-guide', 'creating-diagrams']
  },
  'configuration-basics': {
    title: 'Configuration Basics',
    description: 'Learn how to configure VisualDocs for your workflow',
    content: 'Customize VisualDocs settings to match your development workflow.',
    sections: [
      {
        id: 'project-settings',
        title: 'Project Settings',
        content: `Access project settings from the project dashboard:

**General Settings:**
- Project name and description
- Default branch for analysis
- Auto-sync with repository

**Analysis Settings:**
- File patterns to include/exclude
- Analysis depth level
- AI documentation style

**Team Settings:**
- Member permissions
- Notification preferences
- Integration webhooks`
      },
      {
        id: 'user-preferences',
        title: 'User Preferences',
        content: `Customize your personal experience:

**Theme:** Choose between light, dark, or system theme
**Editor:** Configure code editor preferences
**Notifications:** Set up email and in-app notifications
**Keyboard Shortcuts:** Customize shortcuts for common actions

Access preferences from the settings icon in the top navigation.`
      }
    ],
    relatedDocs: ['first-project-setup', 'project-organization']
  },
  'creating-diagrams': {
    title: 'Creating Diagrams',
    description: 'Learn to create beautiful diagrams from your code',
    content: 'VisualDocs can automatically generate various diagram types from your codebase.',
    sections: [
      {
        id: 'diagram-types',
        title: 'Supported Diagram Types',
        content: `VisualDocs supports multiple diagram types:

**Architecture Diagrams:**
- System overview
- Component relationships
- Service dependencies

**Flow Diagrams:**
- Data flow visualization
- User journey maps
- Process workflows

**Class Diagrams:**
- Inheritance hierarchies
- Interface implementations
- Property and method views

**Sequence Diagrams:**
- API call flows
- Event sequences
- Interaction patterns`
      },
      {
        id: 'generating-diagrams',
        title: 'Generating Diagrams',
        content: `**Automatic Generation:**
1. Navigate to the Diagrams tab in your project
2. Click "Generate New Diagram"
3. Select diagram type
4. Choose scope (full project or specific modules)
5. Click "Generate"

**Manual Creation:**
1. Open the Diagram Studio
2. Use drag-and-drop components
3. Connect elements with relationship lines
4. Customize colors and styles
5. Export in various formats (PNG, SVG, PDF)`
      },
      {
        id: 'customization',
        title: 'Customizing Diagrams',
        content: `Make your diagrams unique:

**Layout Options:**
- Horizontal, vertical, or radial layouts
- Auto-arrange for optimal spacing
- Manual positioning

**Styling:**
- Custom color schemes
- Font and text options
- Line styles and arrows

**Export Options:**
- High-resolution images
- Vector formats (SVG)
- Embedded in documentation`
      }
    ],
    relatedDocs: ['ai-analysis-features', 'team-collaboration']
  },
  'team-collaboration': {
    title: 'Team Collaboration',
    description: 'Work together with your team on documentation',
    content: 'Learn how to collaborate effectively with your team on VisualDocs projects.',
    sections: [
      {
        id: 'inviting-members',
        title: 'Inviting Team Members',
        content: `**Adding Members:**
1. Go to your project settings
2. Navigate to "Team" tab
3. Click "Invite Member"
4. Enter email addresses
5. Select role (Admin, Editor, Viewer)
6. Send invitations

**Member Roles:**
- **Admin:** Full access, can manage team
- **Editor:** Can edit docs and diagrams
- **Viewer:** Read-only access`
      },
      {
        id: 'real-time-editing',
        title: 'Real-Time Editing',
        content: `Collaborate in real-time:

- See who's currently viewing the document
- Live cursors show where team members are working
- Changes sync instantly across all users
- Conflict resolution for simultaneous edits

**Best Practices:**
- Communicate via built-in comments
- Use @mentions to notify team members
- Lock sections when making major changes`
      },
      {
        id: 'comments-review',
        title: 'Comments & Review',
        content: `**Adding Comments:**
1. Select text or element
2. Click the comment icon
3. Type your comment
4. Tag team members with @

**Review Workflow:**
1. Submit changes for review
2. Reviewers receive notifications
3. Add feedback and suggestions
4. Approve or request changes
5. Merge approved changes`
      }
    ],
    relatedDocs: ['project-organization', 'creating-diagrams']
  },
  'ai-analysis-features': {
    title: 'AI Analysis Features',
    description: 'Leverage AI to understand and document your code',
    content: 'Discover the powerful AI features that make VisualDocs unique.',
    sections: [
      {
        id: 'code-analysis',
        title: 'Intelligent Code Analysis',
        content: `**What AI Analyzes:**
- Function purposes and behaviors
- Code complexity and patterns
- Dependencies and relationships
- Potential issues and improvements

**Analysis Depth:**
- Quick scan for overview
- Standard analysis for most projects
- Deep analysis for comprehensive documentation`
      },
      {
        id: 'auto-documentation',
        title: 'Automatic Documentation',
        content: `AI generates documentation automatically:

**Function Documentation:**
- Purpose and description
- Parameter explanations
- Return value details
- Usage examples

**Module Documentation:**
- Overview and purpose
- Exported APIs
- Internal structure
- Dependencies

**Project Documentation:**
- Architecture overview
- Getting started guide
- API reference
- Best practices`
      },
      {
        id: 'suggestions',
        title: 'Smart Suggestions',
        content: `AI provides actionable suggestions:

**Code Improvements:**
- Refactoring opportunities
- Performance optimizations
- Security enhancements

**Documentation Gaps:**
- Missing documentation
- Outdated content
- Incomplete examples

**Best Practices:**
- Naming conventions
- Code organization
- Testing recommendations`
      }
    ],
    relatedDocs: ['creating-diagrams', 'rest-api-endpoints']
  },
  'rest-api-endpoints': {
    title: 'REST API Endpoints',
    description: 'Complete reference for all API endpoints',
    content: 'Comprehensive documentation of all available API endpoints.',
    sections: [
      {
        id: 'authentication-endpoints',
        title: 'Authentication Endpoints',
        content: `**POST /api/auth/register**
Register a new user account.
\`\`\`json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
\`\`\`

**POST /api/auth/login**
Authenticate and receive tokens.
\`\`\`json
{
  "email": "user@example.com",
  "password": "securepassword"
}
\`\`\`

**POST /api/auth/refresh**
Refresh access token using refresh token.`
      },
      {
        id: 'project-endpoints',
        title: 'Project Endpoints',
        content: `**GET /api/projects**
List all projects for authenticated user.

**POST /api/projects**
Create a new project.
\`\`\`json
{
  "name": "My Project",
  "description": "Project description",
  "visibility": "private"
}
\`\`\`

**GET /api/projects/:id**
Get project details by ID.

**PUT /api/projects/:id**
Update project settings.

**DELETE /api/projects/:id**
Delete a project.`
      },
      {
        id: 'analysis-endpoints',
        title: 'Analysis Endpoints',
        content: `**POST /api/analysis/:projectId/analyze**
Start code analysis for a project.

**GET /api/analysis/:projectId/status**
Check analysis progress.

**GET /api/analysis/:projectId/results**
Get analysis results.

**GET /api/analysis/:projectId/documentation**
Get generated documentation.`
      }
    ],
    relatedDocs: ['authentication', 'webhooks']
  },
  'authentication': {
    title: 'Authentication',
    description: 'Secure your API requests with proper authentication',
    content: 'Learn how to authenticate with the VisualDocs API.',
    sections: [
      {
        id: 'jwt-tokens',
        title: 'JWT Token Authentication',
        content: `VisualDocs uses JWT (JSON Web Tokens) for authentication.

**Token Types:**
- **Access Token:** Short-lived, used for API requests
- **Refresh Token:** Long-lived, used to get new access tokens

**Token Lifetime:**
- Access Token: 15 minutes
- Refresh Token: 7 days`
      },
      {
        id: 'using-tokens',
        title: 'Using Tokens in Requests',
        content: `Include the access token in the Authorization header:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \\
  https://api.visualdocs.com/api/projects
\`\`\`

**Token Refresh Flow:**
1. Access token expires
2. Send refresh token to /api/auth/refresh
3. Receive new access token
4. Continue with new token`
      },
      {
        id: 'oauth',
        title: 'OAuth Integration',
        content: `**Supported OAuth Providers:**
- GitHub
- Google
- GitLab

**OAuth Flow:**
1. Redirect user to /api/auth/oauth/:provider
2. User authorizes application
3. Callback with authorization code
4. Exchange code for tokens`
      }
    ],
    relatedDocs: ['rest-api-endpoints', 'security-guidelines']
  },
  'webhooks': {
    title: 'Webhooks',
    description: 'Set up webhooks for real-time notifications',
    content: 'Configure webhooks to receive notifications about events in your projects.',
    sections: [
      {
        id: 'setting-up',
        title: 'Setting Up Webhooks',
        content: `**Create a Webhook:**
1. Navigate to Project Settings > Webhooks
2. Click "Add Webhook"
3. Enter your endpoint URL
4. Select events to subscribe to
5. Save the webhook

**Webhook URL Requirements:**
- Must be HTTPS
- Must respond within 30 seconds
- Should return 2xx status code`
      },
      {
        id: 'events',
        title: 'Available Events',
        content: `**Project Events:**
- \`project.created\` - New project created
- \`project.updated\` - Project settings changed
- \`project.deleted\` - Project removed

**Analysis Events:**
- \`analysis.started\` - Analysis begun
- \`analysis.completed\` - Analysis finished
- \`analysis.failed\` - Analysis error

**Documentation Events:**
- \`docs.generated\` - New docs created
- \`docs.updated\` - Documentation changed`
      },
      {
        id: 'payload',
        title: 'Webhook Payload',
        content: `**Example Payload:**
\`\`\`json
{
  "event": "analysis.completed",
  "timestamp": "2024-01-15T10:30:00Z",
  "project": {
    "id": "proj_123",
    "name": "My Project"
  },
  "data": {
    "duration": 45,
    "files_analyzed": 150
  }
}
\`\`\`

**Verifying Webhooks:**
Each webhook includes a signature header for verification.`
      }
    ],
    relatedDocs: ['rest-api-endpoints', 'authentication']
  },
  'project-organization': {
    title: 'Project Organization',
    description: 'Best practices for organizing your projects',
    content: 'Learn how to structure your projects for optimal documentation.',
    sections: [
      {
        id: 'folder-structure',
        title: 'Recommended Folder Structure',
        content: `**Organize by Feature:**
\`\`\`
src/
├── features/
│   ├── auth/
│   ├── dashboard/
│   └── settings/
├── shared/
│   ├── components/
│   ├── hooks/
│   └── utils/
└── core/
    ├── api/
    └── config/
\`\`\`

**Benefits:**
- Easier to navigate
- Better documentation grouping
- Clear module boundaries`
      },
      {
        id: 'naming-conventions',
        title: 'Naming Conventions',
        content: `**Files:**
- Components: PascalCase (UserProfile.tsx)
- Utilities: camelCase (formatDate.ts)
- Constants: UPPER_SNAKE_CASE

**Functions:**
- Action verbs: getUserById, createProject
- Boolean: isValid, hasPermission
- Handlers: handleClick, onSubmit

**Variables:**
- Descriptive names
- Avoid abbreviations
- Use meaningful prefixes`
      }
    ],
    relatedDocs: ['performance-optimization', 'security-guidelines']
  },
  'performance-optimization': {
    title: 'Performance Optimization',
    description: 'Tips for optimizing VisualDocs performance',
    content: 'Optimize your VisualDocs experience with these performance tips.',
    sections: [
      {
        id: 'analysis-optimization',
        title: 'Optimizing Analysis',
        content: `**Reduce Analysis Time:**
- Use .visualdocsignore to exclude unnecessary files
- Focus on specific modules instead of entire codebase
- Schedule analyses during off-peak hours

**Exclude Patterns:**
\`\`\`
# .visualdocsignore
node_modules/
dist/
*.test.ts
*.spec.ts
\`\`\``
      },
      {
        id: 'large-projects',
        title: 'Handling Large Projects',
        content: `**For Projects with 1000+ Files:**
1. Use incremental analysis
2. Split into sub-projects
3. Enable caching
4. Use selective documentation

**Memory Management:**
- Close unused tabs
- Clear browser cache periodically
- Use the desktop app for large projects`
      }
    ],
    relatedDocs: ['project-organization', 'configuration-basics']
  },
  'security-guidelines': {
    title: 'Security Guidelines',
    description: 'Keep your documentation and code secure',
    content: 'Follow these security best practices for VisualDocs.',
    sections: [
      {
        id: 'access-control',
        title: 'Access Control',
        content: `**Project Permissions:**
- Review member access regularly
- Use principle of least privilege
- Remove inactive members
- Audit access logs

**Visibility Settings:**
- Private: Only team members
- Internal: Organization members
- Public: Anyone can view`
      },
      {
        id: 'sensitive-data',
        title: 'Protecting Sensitive Data',
        content: `**Never Include in Analysis:**
- API keys and secrets
- Passwords and credentials
- Personal information
- Proprietary algorithms

**Use .visualdocsignore:**
\`\`\`
# Exclude sensitive files
.env
.env.local
secrets/
credentials/
\`\`\``
      },
      {
        id: 'api-security',
        title: 'API Security',
        content: `**Token Management:**
- Store tokens securely
- Never expose in client-side code
- Rotate tokens regularly
- Use environment variables

**HTTPS Only:**
All API calls must use HTTPS.
Never transmit tokens over HTTP.`
      }
    ],
    relatedDocs: ['authentication', 'project-organization']
  },
  'getting-started-with-visualdocs': {
    title: 'Getting Started with VisualDocs',
    description: 'Your complete guide to getting started with VisualDocs',
    content: 'Welcome to VisualDocs! This guide will help you get up and running quickly.',
    sections: [
      {
        id: 'overview',
        title: 'What is VisualDocs?',
        content: `VisualDocs is an AI-powered documentation platform that:

- **Automatically generates documentation** from your codebase
- **Creates visual diagrams** of your code structure
- **Enables team collaboration** on documentation
- **Provides intelligent insights** about your code

Whether you're a solo developer or part of a large team, VisualDocs helps you maintain up-to-date, comprehensive documentation.`
      },
      {
        id: 'quick-start',
        title: 'Quick Start (5 minutes)',
        content: `**Step 1:** Create an account at visualdocs.com
**Step 2:** Connect your GitHub repository
**Step 3:** Run your first analysis
**Step 4:** Explore generated documentation

That's it! You now have AI-generated documentation for your project.`
      }
    ],
    relatedDocs: ['installation-guide', 'first-project-setup']
  },
  'creating-your-first-diagram': {
    title: 'Creating Your First Diagram',
    description: 'Step-by-step guide to creating your first diagram',
    content: 'Learn how to create beautiful diagrams in VisualDocs.',
    sections: [
      {
        id: 'opening-studio',
        title: 'Opening Diagram Studio',
        content: `1. Navigate to your project
2. Click on "Diagrams" in the sidebar
3. Click "New Diagram" or "Open Studio"
4. Select your diagram type`
      },
      {
        id: 'first-diagram',
        title: 'Creating Your Diagram',
        content: `**Auto-Generate:**
Click "Auto-Generate" to let AI create a diagram based on your code.

**Manual Creation:**
1. Drag components from the left panel
2. Connect them with arrows
3. Add labels and descriptions
4. Style with colors and icons

**Export:**
Save your diagram as PNG, SVG, or embed in documentation.`
      }
    ],
    relatedDocs: ['creating-diagrams', 'ai-analysis-features']
  },
  'ai-powered-code-analysis': {
    title: 'AI-Powered Code Analysis',
    description: 'Deep dive into AI analysis capabilities',
    content: 'Understand how VisualDocs AI analyzes and documents your code.',
    sections: [
      {
        id: 'how-it-works',
        title: 'How It Works',
        content: `Our AI uses advanced language models to:

1. **Parse your code** - Understand syntax and structure
2. **Identify patterns** - Recognize design patterns and conventions
3. **Generate descriptions** - Create human-readable documentation
4. **Suggest improvements** - Provide actionable recommendations`
      },
      {
        id: 'accuracy',
        title: 'Improving Accuracy',
        content: `**Tips for Better Results:**
- Use descriptive function names
- Add inline comments for complex logic
- Structure code consistently
- Include type annotations

The AI learns from your feedback - rate suggestions to improve future results.`
      }
    ],
    relatedDocs: ['ai-analysis-features', 'creating-diagrams']
  },
  'team-collaboration-features': {
    title: 'Team Collaboration Features',
    description: 'Everything about team features in VisualDocs',
    content: 'Explore all the ways your team can collaborate on documentation.',
    sections: [
      {
        id: 'features-overview',
        title: 'Collaboration Features',
        content: `**Real-Time Editing:**
- Multiple users can edit simultaneously
- See live cursors and changes
- Automatic conflict resolution

**Communication:**
- In-document comments
- @mentions for notifications
- Discussion threads

**Review Workflow:**
- Submit changes for review
- Approval workflow
- Version history`
      }
    ],
    relatedDocs: ['team-collaboration', 'project-organization']
  }
};

// Helper to convert title to slug
const titleToSlug = (title: string): string => {
  return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

// Calculate reading time based on content
const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

export const Documentation = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [bookmarkedDocs, setBookmarkedDocs] = useState<string[]>([]);
  const [likedDocs, setLikedDocs] = useState<string[]>([]);
  const [readProgress, setReadProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);

  // Track scroll progress in dialog
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight - target.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    setReadProgress(progress);
    setShowScrollTop(scrollTop > 300);
  }, []);

  // Toggle bookmark
  const toggleBookmark = (slug: string) => {
    setBookmarkedDocs(prev => 
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  // Toggle like
  const toggleLike = (slug: string) => {
    setLikedDocs(prev => 
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  // Copy link to clipboard
  const copyDocLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/app/documentation#${slug}`);
    setCopiedCode('link');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const documentationSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Rocket,
      description: 'Quick start guides and tutorials',
      docs: [
        { title: 'Installation Guide', status: 'complete', time: '5 min', slug: 'installation-guide', views: 1523 },
        { title: 'First Project Setup', status: 'complete', time: '10 min', slug: 'first-project-setup', views: 1245 },
        { title: 'Configuration Basics', status: 'in-progress', time: '8 min', slug: 'configuration-basics', views: 892 },
      ]
    },
    {
      id: 'guides',
      title: 'Guides',
      icon: BookOpen,
      description: 'Step-by-step guides for common tasks',
      docs: [
        { title: 'Creating Diagrams', status: 'complete', time: '15 min', slug: 'creating-diagrams', views: 987 },
        { title: 'Team Collaboration', status: 'complete', time: '12 min', slug: 'team-collaboration', views: 742 },
        { title: 'AI Analysis Features', status: 'complete', time: '20 min', slug: 'ai-analysis-features', views: 856 },
      ]
    },
    {
      id: 'api',
      title: 'API Reference',
      icon: Code,
      description: 'Complete API documentation',
      docs: [
        { title: 'REST API Endpoints', status: 'complete', time: '25 min', slug: 'rest-api-endpoints', views: 654 },
        { title: 'Authentication', status: 'complete', time: '10 min', slug: 'authentication', views: 1102 },
        { title: 'Webhooks', status: 'in-progress', time: '15 min', slug: 'webhooks', views: 423 },
      ]
    },
    {
      id: 'best-practices',
      title: 'Best Practices',
      icon: Lightbulb,
      description: 'Tips and recommendations',
      docs: [
        { title: 'Project Organization', status: 'complete', time: '8 min', slug: 'project-organization', views: 567 },
        { title: 'Performance Optimization', status: 'complete', time: '12 min', slug: 'performance-optimization', views: 489 },
        { title: 'Security Guidelines', status: 'complete', time: '10 min', slug: 'security-guidelines', views: 634 },
      ]
    },
  ];

  const popularDocs = [
    { title: 'Getting Started with VisualDocs', views: 1234, rating: 4.8, slug: 'getting-started-with-visualdocs' },
    { title: 'Creating Your First Diagram', views: 987, rating: 4.9, slug: 'creating-your-first-diagram' },
    { title: 'AI-Powered Code Analysis', views: 856, rating: 4.7, slug: 'ai-powered-code-analysis' },
    { title: 'Team Collaboration Features', views: 742, rating: 4.6, slug: 'team-collaboration-features' },
  ];

  const recentDocs = [
    { title: 'Diagram Studio Features', slug: 'creating-diagrams', updated: '2 hours ago', badge: 'New' },
    { title: 'AI Analysis Guide', slug: 'ai-analysis-features', updated: '1 day ago', badge: 'Updated' },
    { title: 'Team Collaboration', slug: 'team-collaboration', updated: '3 days ago', badge: 'Updated' },
    { title: 'REST API Endpoints', slug: 'rest-api-endpoints', updated: '5 days ago', badge: 'Updated' },
    { title: 'Security Guidelines', slug: 'security-guidelines', updated: '1 week ago', badge: 'Updated' },
  ];

  // Filter documentation based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return documentationSections;
    
    const query = searchQuery.toLowerCase();
    return documentationSections.map(section => ({
      ...section,
      docs: section.docs.filter(doc => 
        doc.title.toLowerCase().includes(query) ||
        section.title.toLowerCase().includes(query) ||
        section.description.toLowerCase().includes(query)
      )
    })).filter(section => section.docs.length > 0);
  }, [searchQuery]);

  const filteredPopularDocs = useMemo(() => {
    if (!searchQuery.trim()) return popularDocs;
    const query = searchQuery.toLowerCase();
    return popularDocs.filter(doc => doc.title.toLowerCase().includes(query));
  }, [searchQuery]);

  const filteredRecentDocs = useMemo(() => {
    if (!searchQuery.trim()) return recentDocs;
    const query = searchQuery.toLowerCase();
    return recentDocs.filter(doc => doc.title.toLowerCase().includes(query));
  }, [searchQuery]);

  // Get all docs for search suggestions
  const allDocs = useMemo(() => {
    const docs: { title: string; slug: string; section: string }[] = [];
    documentationSections.forEach(section => {
      section.docs.forEach(doc => {
        docs.push({ title: doc.title, slug: doc.slug, section: section.title });
      });
    });
    return docs;
  }, []);

  const handleDocClick = (slug: string) => {
    setSelectedDoc(slug);
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Helper to parse inline formatting (bold, code, links)
  const parseInlineFormatting = (text: string, keyPrefix: string) => {
    const elements: (string | JSX.Element)[] = [];
    let currentText = text;
    let keyIndex = 0;

    // Process bold text
    const boldRegex = /\*\*(.+?)\*\*/g;
    let lastIndex = 0;
    let match;
    
    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        elements.push(text.substring(lastIndex, match.index));
      }
      elements.push(<strong key={`${keyPrefix}-bold-${keyIndex++}`} className="font-semibold text-[#37322F]">{match[1]}</strong>);
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex === 0) {
      // No bold text found, check for inline code
      const codeRegex = /`([^`]+)`/g;
      while ((match = codeRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          elements.push(text.substring(lastIndex, match.index));
        }
        elements.push(
          <code key={`${keyPrefix}-code-${keyIndex++}`} className="bg-[#E8D5C4]/50 text-[#37322F] px-1.5 py-0.5 rounded text-sm font-mono border border-[#37322F]/15">
            {match[1]}
          </code>
        );
        lastIndex = match.index + match[0].length;
      }
    }
    
    if (lastIndex < text.length) {
      elements.push(text.substring(lastIndex));
    }
    
    return elements.length > 0 ? elements : [text];
  };

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let listItems: JSX.Element[] = [];
    let isInList = false;
    let listType: 'ul' | 'ol' = 'ul';

    lines.forEach((line, idx) => {
      // Skip code block markers
      if (line.startsWith('```')) {
        return;
      }

      // Check if line is a bullet point
      const isBullet = line.startsWith('- ') || line.startsWith('• ');
      const isNumbered = /^\d+\.\s/.test(line);
      const isListItem = isBullet || isNumbered;

      // If we were in a list and now we're not, close the list
      if (isInList && !isListItem && line.trim()) {
        elements.push(
          listType === 'ul' ? (
            <ul key={`list-${idx}`} className="space-y-2 my-4 ml-1">
              {listItems}
            </ul>
          ) : (
            <ol key={`list-${idx}`} className="space-y-2 my-4 ml-1 list-decimal list-inside">
              {listItems}
            </ol>
          )
        );
        listItems = [];
        isInList = false;
      }

      if (isBullet) {
        isInList = true;
        listType = 'ul';
        const content = line.substring(2);
        listItems.push(
          <li key={`li-${idx}`} className="flex items-start gap-2 text-[#605A57]">
            <span className="text-[#37322F] mt-1.5 text-xs">●</span>
            <span>{parseInlineFormatting(content, `li-${idx}`)}</span>
          </li>
        );
      } else if (isNumbered) {
        isInList = true;
        listType = 'ol';
        const content = line.replace(/^\d+\.\s*/, '');
        listItems.push(
          <li key={`li-${idx}`} className="text-[#605A57] ml-4">
            {parseInlineFormatting(content, `li-${idx}`)}
          </li>
        );
      } else if (!line.trim()) {
        // Empty line - add spacing but not inside lists
        if (!isInList) {
          elements.push(<div key={`space-${idx}`} className="h-3" />);
        }
      } else {
        // Regular paragraph with inline formatting
        elements.push(
          <p key={`p-${idx}`} className="text-[#605A57] leading-relaxed mb-2">
            {parseInlineFormatting(line, `p-${idx}`)}
          </p>
        );
      }
    });

    // Close any remaining list
    if (isInList && listItems.length > 0) {
      elements.push(
        listType === 'ul' ? (
          <ul key="final-list" className="space-y-2 my-4 ml-1">
            {listItems}
          </ul>
        ) : (
          <ol key="final-list" className="space-y-2 my-4 ml-1 list-decimal list-inside">
            {listItems}
          </ol>
        )
      );
    }

    return elements;
  };

  const renderCodeBlock = (content: string, sectionId: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts: JSX.Element[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push(
          <div key={`text-${lastIndex}`}>
            {renderContent(content.substring(lastIndex, match.index))}
          </div>
        );
      }

      const language = match[1] || 'text';
      const code = match[2].trim();
      const codeId = `${sectionId}-${match.index}`;

      parts.push(
        <div key={`code-${match.index}`} className="relative my-5 rounded-xl overflow-hidden border border-[#37322F]/15 shadow-sm">
          <div className="flex items-center justify-between bg-[#E8D5C4]/30 px-4 py-2.5 border-b border-[#37322F]/10">
            <span className="text-xs font-semibold text-[#605A57] uppercase tracking-wide">{language}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-[#605A57] hover:text-[#37322F] hover:bg-[#E8D5C4]/50"
              onClick={() => handleCopyCode(code, codeId)}
            >
              {copiedCode === codeId ? (
                <>
                  <Check className="h-3 w-3 mr-1 text-green-600" />
                  <span className="text-green-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <pre className="bg-[#37322F] text-[#F7F5F3] p-4 overflow-x-auto text-sm font-mono leading-relaxed">
            <code>{code}</code>
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(
        <div key={`text-${lastIndex}`}>
          {renderContent(content.substring(lastIndex))}
        </div>
      );
    }

    return parts.length > 0 ? parts : renderContent(content);
  };

  const currentDoc = selectedDoc ? documentationContent[selectedDoc] : null;
  const docReadTime = currentDoc ? 
    currentDoc.sections.reduce((acc, s) => acc + calculateReadTime(s.content), 0) + calculateReadTime(currentDoc.content) : 0;

  return (
    <PremiumLayout>
      <div className="min-h-screen bg-[#F7F5F3]">
        {/* Premium Documentation Detail Dialog */}
        <Dialog open={!!selectedDoc} onOpenChange={(open) => !open && setSelectedDoc(null)}>
          <DialogContent className="max-w-5xl max-h-[92vh] p-0 bg-white border border-[#37322F]/10 shadow-2xl rounded-2xl overflow-hidden gap-0">
            {currentDoc && (
              <div className="flex flex-col h-full">
                {/* Reading Progress Bar */}
                <div className="h-1 bg-[#E8D5C4] w-full">
                  <div 
                    className="h-full bg-gradient-to-r from-[#37322F] to-[#605A57] transition-all duration-300 ease-out"
                    style={{ width: `${readProgress}%` }}
                  />
                </div>

                {/* Premium Header */}
                <div className="px-8 pt-6 pb-5 border-b border-[#37322F]/10 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedDoc(null)}
                      className="h-9 px-3 text-[#605A57] hover:text-[#37322F] hover:bg-[#E8D5C4]/50 rounded-lg -ml-2"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to docs
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLike(selectedDoc!)}
                        className={`h-9 w-9 p-0 rounded-lg transition-all ${
                          likedDocs.includes(selectedDoc!) 
                            ? 'text-rose-500 bg-rose-50 hover:bg-rose-100' 
                            : 'text-[#605A57] hover:text-[#37322F] hover:bg-[#E8D5C4]/50'
                        }`}
                      >
                        <ThumbsUp className={`h-4 w-4 ${likedDocs.includes(selectedDoc!) ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBookmark(selectedDoc!)}
                        className={`h-9 w-9 p-0 rounded-lg transition-all ${
                          bookmarkedDocs.includes(selectedDoc!) 
                            ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' 
                            : 'text-[#605A57] hover:text-[#37322F] hover:bg-[#E8D5C4]/50'
                        }`}
                      >
                        <Bookmark className={`h-4 w-4 ${bookmarkedDocs.includes(selectedDoc!) ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyDocLink(selectedDoc!)}
                        className="h-9 w-9 p-0 rounded-lg text-[#605A57] hover:text-[#37322F] hover:bg-[#E8D5C4]/50"
                      >
                        {copiedCode === 'link' ? <Check className="h-4 w-4 text-green-600" /> : <Share2 className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDoc(null)}
                        className="h-9 w-9 p-0 rounded-lg text-[#605A57] hover:text-[#37322F] hover:bg-[#E8D5C4]/50 ml-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Title and Meta */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-[#37322F]/10 text-[#37322F] border-0 font-medium">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Guide
                      </Badge>
                      <div className="flex items-center gap-4 text-sm text-[#605A57]">
                        <span className="flex items-center gap-1.5">
                          <Timer className="h-3.5 w-3.5" />
                          {docReadTime} min read
                        </span>
                        <span className="flex items-center gap-1.5">
                          <BookMarked className="h-3.5 w-3.5" />
                          {currentDoc.sections.length} sections
                        </span>
                      </div>
                    </div>
                    <h1 className="text-3xl font-bold text-[#37322F] tracking-tight">{currentDoc.title}</h1>
                    <p className="text-[#605A57] text-lg">{currentDoc.description}</p>
                  </div>
                </div>

                {/* Content Area with Sidebar */}
                <div className="flex flex-1 overflow-hidden">
                  {/* Sidebar - Table of Contents */}
                  <div className={`${sidebarOpen ? 'w-64' : 'w-0'} border-r border-[#37322F]/10 bg-white transition-all duration-300 overflow-hidden flex-shrink-0`}>
                    <div className="p-5 w-64">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-xs uppercase tracking-wider text-[#605A57]">On this page</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSidebarOpen(false)}
                          className="h-6 w-6 p-0 text-[#605A57] hover:text-[#37322F]"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <nav className="space-y-1">
                        {currentDoc.sections.map((section, idx) => (
                          <button
                            key={section.id}
                            onClick={() => {
                              document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                              setActiveSection(section.id);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 group ${
                              activeSection === section.id
                                ? 'bg-[#37322F]/10 text-[#37322F] font-medium'
                                : 'text-[#605A57] hover:bg-[#E8D5C4]/50 hover:text-[#37322F]'
                            }`}
                          >
                            <Hash className={`h-3.5 w-3.5 flex-shrink-0 ${activeSection === section.id ? 'text-[#37322F]' : 'text-[#605A57] group-hover:text-[#37322F]'}`} />
                            <span className="truncate">{section.title}</span>
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>

                  {/* Main Content */}
                  <ScrollArea 
                    className="flex-1 h-[calc(92vh-200px)] bg-white"
                    onScrollCapture={handleScroll}
                  >
                    <div className="p-8 max-w-3xl mx-auto bg-white">
                      {/* Toggle sidebar button if closed */}
                      {!sidebarOpen && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSidebarOpen(true)}
                          className="mb-6 text-[#605A57] border-[#37322F]/15 hover:bg-[#E8D5C4]/30"
                        >
                          <Menu className="h-4 w-4 mr-2" />
                          Show contents
                        </Button>
                      )}

                      {/* Introduction */}
                      <div className="prose prose-gray max-w-none mb-10">
                        <p className="text-[#605A57] text-lg leading-relaxed">{currentDoc.content}</p>
                      </div>

                      {/* Sections */}
                      {currentDoc.sections.map((section, idx) => (
                        <section key={section.id} id={section.id} className="mb-12 scroll-mt-8">
                          <div className="flex items-center gap-3 mb-5 group">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#E8D5C4]/50 text-[#605A57] font-semibold text-sm group-hover:bg-[#37322F]/10 group-hover:text-[#37322F] transition-colors">
                              {idx + 1}
                            </div>
                            <h2 className="text-2xl font-bold text-[#37322F]">{section.title}</h2>
                          </div>
                          <div className="pl-11 text-[#605A57] leading-relaxed">
                            {renderCodeBlock(section.content, section.id)}
                          </div>
                        </section>
                      ))}

                      {/* Related Docs */}
                      {currentDoc.relatedDocs && currentDoc.relatedDocs.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-[#37322F]/10">
                          <h3 className="text-lg font-semibold mb-4 text-[#37322F] flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-[#605A57]" />
                            Continue reading
                          </h3>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {currentDoc.relatedDocs.map((slug) => {
                              const relatedDoc = documentationContent[slug];
                              if (!relatedDoc) return null;
                              return (
                                <button
                                  key={slug}
                                  onClick={() => {
                                    setSelectedDoc(slug);
                                    setReadProgress(0);
                                    setActiveSection(null);
                                  }}
                                  className="flex items-center gap-3 p-4 rounded-xl border border-[#37322F]/10 bg-white hover:border-[#37322F]/25 hover:bg-[#E8D5C4]/20 transition-all duration-200 text-left group"
                                >
                                  <div className="w-10 h-10 rounded-lg bg-[#E8D5C4]/50 flex items-center justify-center group-hover:bg-[#37322F]/10 transition-colors">
                                    <FileText className="h-5 w-5 text-[#605A57] group-hover:text-[#37322F]" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-[#37322F] group-hover:text-[#37322F] truncate">{relatedDoc.title}</h4>
                                    <p className="text-sm text-[#605A57] truncate">{relatedDoc.description}</p>
                                  </div>
                                  <ChevronRight className="h-5 w-5 text-[#E8D5C4] group-hover:text-[#37322F] flex-shrink-0" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Feedback Section */}
                      <div className="mt-12 p-6 rounded-2xl bg-white border border-[#37322F]/10">
                        <h3 className="font-semibold text-[#37322F] mb-2">Was this helpful?</h3>
                        <p className="text-sm text-[#605A57] mb-4">Let us know if this documentation helped you.</p>
                        <div className="flex items-center gap-3">
                          <Button
                            variant={likedDocs.includes(selectedDoc!) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleLike(selectedDoc!)}
                            className={likedDocs.includes(selectedDoc!) ? "bg-[#37322F] hover:bg-[#37322F]/90 text-white" : "border-[#37322F]/15 text-[#605A57] hover:bg-[#E8D5C4]/30"}
                          >
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Yes, it helped
                          </Button>
                          <Button variant="outline" size="sm" className="border-[#37322F]/15 text-[#605A57] hover:bg-[#E8D5C4]/30">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Suggest edit
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Scroll to top button */}
                    {showScrollTop && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="fixed bottom-8 right-8 h-10 w-10 p-0 rounded-full shadow-lg bg-white border-[#37322F]/15 hover:bg-[#E8D5C4]/30 z-50"
                        onClick={() => {
                          document.querySelector('[data-radix-scroll-area-viewport]')?.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        <ArrowUp className="h-4 w-4 text-[#37322F]" />
                      </Button>
                    )}
                  </ScrollArea>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Header */}
        <div className="bg-white border-b border-[#37322F]/10 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#E8D5C4]/50 rounded-2xl">
                  <FileText className="h-8 w-8 text-[#37322F]" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-[#37322F] tracking-tight">Documentation</h1>
                  <p className="text-[#605A57] mt-0.5">
                    Everything you need to know about VisualDocs
                  </p>
                </div>
              </div>
              {bookmarkedDocs.length > 0 && (
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                  <Bookmark className="h-3.5 w-3.5 mr-1.5 fill-current" />
                  {bookmarkedDocs.length} bookmarked
                </Badge>
              )}
            </div>
            
            {/* Search Bar */}
            <div className={`relative max-w-2xl mt-6 transition-all duration-300 ${searchFocused ? 'max-w-3xl' : ''}`}>
              <div className={`absolute inset-0 bg-[#E8D5C4]/30 rounded-2xl transition-all duration-300 ${searchFocused ? 'scale-105 opacity-100' : 'scale-100 opacity-0'}`} />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#605A57] z-10" />
              <Input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="pl-12 h-14 bg-[#F7F5F3] border-[#37322F]/15 focus:bg-white focus:border-[#37322F] focus:ring-2 focus:ring-[#37322F]/20 transition-all rounded-2xl text-base relative z-10 text-[#37322F] placeholder:text-[#605A57]"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-8 text-[#605A57] hover:text-[#37322F] z-10"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Search Results Summary */}
            {searchQuery && (
              <div className="mt-4 text-sm text-[#605A57] flex items-center gap-2">
                <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 bg-[#37322F] text-white text-xs font-semibold rounded-full">
                  {filteredSections.reduce((acc, s) => acc + s.docs.length, 0)}
                </span>
                <span>results found for "<span className="font-medium text-[#37322F]">{searchQuery}</span>"</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-white border border-[#37322F]/10 p-1.5 rounded-2xl shadow-sm">
              <TabsTrigger value="all" className="rounded-xl px-4 py-2.5 data-[state=active]:bg-[#37322F] data-[state=active]:text-white data-[state=active]:shadow-sm transition-all text-[#605A57]">
                <FileText className="h-4 w-4 mr-2" />
                All Docs
              </TabsTrigger>
              <TabsTrigger value="popular" className="rounded-xl px-4 py-2.5 data-[state=active]:bg-[#37322F] data-[state=active]:text-white data-[state=active]:shadow-sm transition-all text-[#605A57]">
                <Star className="h-4 w-4 mr-2" />
                Popular
              </TabsTrigger>
              <TabsTrigger value="recent" className="rounded-xl px-4 py-2.5 data-[state=active]:bg-[#37322F] data-[state=active]:text-white data-[state=active]:shadow-sm transition-all text-[#605A57]">
                <Clock className="h-4 w-4 mr-2" />
                Recent
              </TabsTrigger>
              {bookmarkedDocs.length > 0 && (
                <TabsTrigger value="bookmarks" className="rounded-xl px-4 py-2.5 data-[state=active]:bg-[#37322F] data-[state=active]:text-white data-[state=active]:shadow-sm transition-all text-[#605A57]">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Saved ({bookmarkedDocs.length})
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {filteredSections.length === 0 ? (
                <Card className="p-12 text-center border-[#37322F]/10 bg-white rounded-2xl">
                  <div className="text-[#605A57]">
                    <div className="w-20 h-20 mx-auto mb-6 bg-[#E8D5C4]/30 rounded-2xl flex items-center justify-center">
                      <Search className="h-10 w-10 text-[#E8D5C4]" />
                    </div>
                    <h3 className="font-semibold text-xl mb-2 text-[#37322F]">No results found</h3>
                    <p className="text-[#605A57] mb-6 max-w-sm mx-auto">We couldn't find any documentation matching your search. Try different keywords.</p>
                    <Button
                      variant="outline"
                      className="border-[#37322F]/15 hover:bg-[#E8D5C4]/30 rounded-xl text-[#605A57]"
                      onClick={() => setSearchQuery('')}
                    >
                      Clear Search
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {filteredSections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <Card key={section.id} className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-[#37322F]/10 bg-white overflow-hidden group rounded-2xl">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-[#E8D5C4]/30 rounded-xl group-hover:bg-[#E8D5C4]/60 transition-colors">
                              <Icon className="h-5 w-5 text-[#605A57] group-hover:text-[#37322F] transition-colors" />
                            </div>
                            <div>
                              <CardTitle className="text-[#37322F]">{section.title}</CardTitle>
                              <CardDescription className="text-[#605A57]">{section.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-1">
                            {section.docs.map((doc, idx) => (
                              <Button
                                key={idx}
                                variant="ghost"
                                className="w-full justify-start h-auto py-3 px-3 hover:bg-[#E8D5C4]/30 rounded-lg group/item"
                                onClick={() => handleDocClick(doc.slug)}
                              >
                                <div className="flex items-center gap-3 w-full">
                                  {doc.status === 'complete' ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                  ) : (
                                    <Clock className="h-4 w-4 text-amber-600 flex-shrink-0" />
                                  )}
                                  <span className="flex-1 text-left text-[#605A57] group-hover/item:text-[#37322F] transition-colors">{doc.title}</span>
                                  <Badge variant="secondary" className="text-xs bg-[#E8D5C4]/50 text-[#605A57] border-0">
                                    {doc.time}
                                  </Badge>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="popular">
              <Card className="border-[#37322F]/10 bg-white rounded-2xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#E8D5C4]/50 rounded-xl">
                      <Star className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <CardTitle className="text-[#37322F]">Popular Documentation</CardTitle>
                      <CardDescription className="text-[#605A57]">Most viewed and highly rated guides</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {filteredPopularDocs.length === 0 ? (
                    <div className="text-center py-12 text-[#605A57]">
                      <div className="w-16 h-16 mx-auto mb-4 bg-[#E8D5C4]/30 rounded-2xl flex items-center justify-center">
                        <Search className="h-7 w-7 text-[#E8D5C4]" />
                      </div>
                      <p className="font-medium text-[#37322F] mb-1">No results</p>
                      <p className="text-sm">No popular docs match your search.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredPopularDocs.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 border border-[#37322F]/10 rounded-xl hover:bg-[#E8D5C4]/20 hover:border-[#37322F]/20 hover:shadow-sm cursor-pointer transition-all duration-300 group"
                          onClick={() => handleDocClick(doc.slug)}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                              idx === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-200' :
                              idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                              idx === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                              'bg-[#E8D5C4]/50 text-[#605A57] group-hover:bg-[#37322F]/10 group-hover:text-[#37322F]'
                            }`}>
                              {idx + 1}
                            </div>
                            <div>
                              <h3 className="font-semibold text-[#37322F] group-hover:text-[#37322F] transition-colors">{doc.title}</h3>
                              <div className="flex items-center gap-4 mt-1.5 text-sm text-[#605A57]">
                                <span className="flex items-center gap-1.5">
                                  <FileText className="h-3.5 w-3.5" />
                                  {doc.views.toLocaleString()} views
                                </span>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                                  <span className="font-semibold text-[#37322F]">{doc.rating}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-[#605A57] group-hover:text-[#37322F] group-hover:bg-[#E8D5C4]/50 transition-all rounded-lg">
                            Read
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recent">
              <Card className="border-[#37322F]/10 bg-white rounded-2xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#E8D5C4]/50 rounded-xl">
                      <Clock className="h-5 w-5 text-[#605A57]" />
                    </div>
                    <div>
                      <CardTitle className="text-[#37322F]">Recently Updated</CardTitle>
                      <CardDescription className="text-[#605A57]">Latest documentation changes and additions</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {filteredRecentDocs.length === 0 ? (
                    <div className="text-center py-12 text-[#605A57]">
                      <div className="w-16 h-16 mx-auto mb-4 bg-[#E8D5C4]/30 rounded-2xl flex items-center justify-center">
                        <Clock className="h-7 w-7 text-[#E8D5C4]" />
                      </div>
                      <p className="font-medium text-[#37322F] mb-1">No results</p>
                      <p className="text-sm">No recent docs match your search.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredRecentDocs.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 border border-[#37322F]/10 rounded-xl hover:bg-[#E8D5C4]/20 hover:border-[#37322F]/20 hover:shadow-sm cursor-pointer transition-all duration-300 group"
                          onClick={() => handleDocClick(doc.slug)}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              doc.badge === 'New' ? 'bg-green-50' : 'bg-[#E8D5C4]/50'
                            }`}>
                              {doc.badge === 'New' ? (
                                <Sparkles className="h-5 w-5 text-green-600" />
                              ) : (
                                <FileText className="h-5 w-5 text-[#605A57]" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-[#37322F] group-hover:text-[#37322F] transition-colors">{doc.title}</h3>
                              <p className="text-sm text-[#605A57] mt-1 flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                Updated {doc.updated}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant={doc.badge === 'New' ? 'default' : 'secondary'}
                              className={doc.badge === 'New' 
                                ? 'bg-green-600 text-white border-0 shadow-sm' 
                                : 'bg-[#E8D5C4]/50 text-[#605A57] border-0'
                              }
                            >
                              {doc.badge}
                            </Badge>
                            <ChevronRight className="h-4 w-4 text-[#E8D5C4] group-hover:text-[#37322F] transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bookmarks Tab */}
            <TabsContent value="bookmarks">
              <Card className="border-[#37322F]/10 bg-white rounded-2xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-50 rounded-xl">
                      <Bookmark className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <CardTitle className="text-[#37322F]">Saved Documentation</CardTitle>
                      <CardDescription className="text-[#605A57]">Your bookmarked articles for quick access</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {bookmarkedDocs.length === 0 ? (
                    <div className="text-center py-12 text-[#605A57]">
                      <div className="w-16 h-16 mx-auto mb-4 bg-[#E8D5C4]/30 rounded-2xl flex items-center justify-center">
                        <Bookmark className="h-7 w-7 text-[#E8D5C4]" />
                      </div>
                      <h3 className="font-medium text-[#37322F] mb-2">No bookmarks yet</h3>
                      <p className="text-sm max-w-xs mx-auto">Save documentation articles by clicking the bookmark icon while reading.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bookmarkedDocs.map((slug) => {
                        const doc = documentationContent[slug];
                        if (!doc) return null;
                        return (
                          <div
                            key={slug}
                            className="flex items-center justify-between p-4 border border-[#37322F]/10 rounded-xl hover:bg-[#E8D5C4]/20 hover:border-[#37322F]/20 cursor-pointer transition-all duration-200 group"
                            onClick={() => handleDocClick(slug)}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                <Bookmark className="h-5 w-5 text-amber-600 fill-current" />
                              </div>
                              <div>
                                <h3 className="font-medium text-[#37322F] group-hover:text-[#37322F] transition-colors">{doc.title}</h3>
                                <p className="text-sm text-[#605A57]">{doc.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-[#605A57] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleBookmark(slug);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <ChevronRight className="h-4 w-4 text-[#E8D5C4] group-hover:text-[#37322F] transition-colors" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Tips Section */}
          <div className="mt-12 p-6 rounded-2xl bg-[#E8D5C4]/30 border border-[#37322F]/10">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <Lightbulb className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[#37322F] mb-1">Pro Tip</h3>
                <p className="text-[#605A57] text-sm">
                  Use <kbd className="px-2 py-0.5 bg-white rounded text-xs font-mono border border-[#37322F]/15">⌘K</kbd> to quickly search across projects and documentation from anywhere in the app.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PremiumLayout>
  );
};
