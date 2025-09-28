import { Octokit } from '@octokit/rest';
import type { 
  GitHubRepository, 
  GitHubFileTree, 
  GitHubImportRequest,
  GitHubImportResult
} from '../types';
import { logger } from '../utils';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors';

export class GitHubService {
  private octokit: Octokit;
  private readonly rateLimitBuffer = 10; // Keep 10 requests as buffer

  constructor() {
    // Initialize Octokit with GitHub token if available
    const githubToken = process.env.GITHUB_TOKEN || process.env.GITHUB_ACCESS_TOKEN;
    
    this.octokit = new Octokit({
      auth: githubToken,
      userAgent: 'VisualDocs/1.0.0',
      retry: {
        doNotRetry: ['429'], // We'll handle rate limiting ourselves
      },
    });

    if (!githubToken) {
      logger.warn('GitHub token not provided. API requests will be limited to 60/hour for unauthenticated requests');
    }
  }

  /**
   * Parse GitHub repository URL and extract owner and repo name
   */
  parseGitHubUrl(githubUrl: string): { owner: string; repo: string } {
    try {
      // Handle various GitHub URL formats
      const patterns = [
        /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?(?:\/.*)?$/,
        /^git@github\.com:([^\/]+)\/([^\/]+?)(?:\.git)?$/,
        /^([^\/]+)\/([^\/]+)$/ // Just owner/repo format
      ];

      for (const pattern of patterns) {
        const match = githubUrl.trim().match(pattern);
        if (match && match[1] && match[2]) {
          const [, owner, repo] = match;
          return { 
            owner: owner.trim(), 
            repo: repo.replace(/\.git$/, '').trim() 
          };
        }
      }

      throw new Error('Invalid GitHub URL format');
    } catch (error) {
      logger.error('Failed to parse GitHub URL:', { githubUrl, error });
      throw new BadRequestError('Invalid GitHub repository URL format. Expected: https://github.com/owner/repo');
    }
  }

  /**
   * Get repository information from GitHub API
   */
  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    try {
      await this.checkRateLimit();

      const { data } = await this.octokit.rest.repos.get({
        owner,
        repo,
      });

      return {
        id: data.id,
        name: data.name,
        fullName: data.full_name,
        description: data.description,
        htmlUrl: data.html_url,
        cloneUrl: data.clone_url,
        defaultBranch: data.default_branch,
        language: data.language,
        stargazersCount: data.stargazers_count,
        forksCount: data.forks_count,
        size: data.size,
        private: data.private,
        fork: data.fork,
        archived: data.archived,
        disabled: data.disabled,
        pushedAt: data.pushed_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error: any) {
      logger.error('Failed to fetch repository:', { owner, repo, error: error.message });
      
      if (error.status === 404) {
        throw new NotFoundError('Repository not found or is private');
      } else if (error.status === 403) {
        throw new UnauthorizedError('Access denied. Repository may be private or rate limit exceeded');
      } else if (error.status === 429) {
        throw new UnauthorizedError('GitHub API rate limit exceeded. Please try again later');
      }
      
      throw new BadRequestError('Failed to access GitHub repository');
    }
  }

  /**
   * Get file tree from repository
   */
  async getFileTree(
    owner: string, 
    repo: string, 
    branch: string = 'main',
    includeTests: boolean = false,
    fileExtensions?: string[]
  ): Promise<GitHubFileTree[]> {
    try {
      await this.checkRateLimit();

      const { data } = await this.octokit.rest.git.getTree({
        owner,
        repo,
        tree_sha: branch,
        recursive: 'true',
      });

      let files = data.tree.filter((item): item is GitHubFileTree => 
        item.type === 'blob' && 
        item.path !== undefined &&
        item.size !== undefined &&
        item.size > 0
      );

      // Filter by file extensions if provided
      if (fileExtensions && fileExtensions.length > 0) {
        files = files.filter(file => 
          fileExtensions.some(ext => 
            file.path.toLowerCase().endsWith(ext.toLowerCase())
          )
        );
      } else {
        // Default to common code file extensions
        const defaultExtensions = [
          '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c', '.h', '.hpp',
          '.cs', '.php', '.rb', '.go', '.rs', '.swift', '.kt', '.scala', '.r',
          '.sql', '.json', '.xml', '.yaml', '.yml', '.toml', '.ini', '.cfg',
          '.sh', '.bash', '.ps1', '.bat', '.dockerfile', '.gitignore', '.env.example'
        ];
        
        files = files.filter(file =>
          defaultExtensions.some(ext => 
            file.path.toLowerCase().endsWith(ext.toLowerCase())
          )
        );
      }

      // Filter out test files if requested
      if (!includeTests) {
        const testPatterns = [
          /test/i, /spec/i, /__tests__/i, /\.test\./i, /\.spec\./i,
          /cypress/i, /jest/i, /vitest/i, /playwright/i
        ];
        
        files = files.filter(file => 
          !testPatterns.some(pattern => pattern.test(file.path))
        );
      }

      logger.info('Retrieved file tree from GitHub:', {
        owner,
        repo,
        branch,
        totalFiles: files.length,
        includeTests
      });

      return files;
    } catch (error: any) {
      logger.error('Failed to fetch file tree:', { owner, repo, branch, error: error.message });
      
      if (error.status === 404) {
        throw new NotFoundError(`Branch '${branch}' not found in repository`);
      } else if (error.status === 403) {
        throw new UnauthorizedError('Access denied or rate limit exceeded');
      }
      
      throw new BadRequestError('Failed to fetch repository file tree');
    }
  }

  /**
   * Get file content from repository
   */
  async getFileContent(owner: string, repo: string, path: string, branch?: string): Promise<{
    content: string;
    encoding: string;
    size: number;
  }> {
    try {
      await this.checkRateLimit();

      const requestParams: {
        owner: string;
        repo: string;
        path: string;
        ref?: string;
      } = {
        owner,
        repo,
        path,
      };

      if (branch) {
        requestParams.ref = branch;
      }

      const { data } = await this.octokit.rest.repos.getContent(requestParams);

      if (Array.isArray(data) || data.type !== 'file') {
        throw new BadRequestError(`Path '${path}' is not a file`);
      }

      // Decode base64 content
      const content = data.encoding === 'base64' 
        ? Buffer.from(data.content, 'base64').toString('utf-8')
        : data.content;

      return {
        content,
        encoding: data.encoding,
        size: data.size,
      };
    } catch (error: any) {
      logger.error('Failed to fetch file content:', { owner, repo, path, error: error.message });
      
      if (error.status === 404) {
        throw new NotFoundError(`File '${path}' not found`);
      } else if (error.status === 403) {
        throw new UnauthorizedError('Access denied or rate limit exceeded');
      }
      
      throw new BadRequestError(`Failed to fetch file content: ${path}`);
    }
  }

  /**
   * Check GitHub API rate limit
   */
  async checkRateLimit(): Promise<void> {
    try {
      const { data } = await this.octokit.rest.rateLimit.get();
      const remaining = data.rate.remaining;
      const resetTime = new Date(data.rate.reset * 1000);

      if (remaining <= this.rateLimitBuffer) {
        const waitTime = resetTime.getTime() - Date.now();
        logger.warn('GitHub API rate limit nearly exceeded:', {
          remaining,
          resetTime: resetTime.toISOString(),
          waitTimeMinutes: Math.ceil(waitTime / (1000 * 60))
        });

        if (waitTime > 0) {
          throw new UnauthorizedError(
            `GitHub API rate limit exceeded. Resets at ${resetTime.toISOString()}. Please try again later.`
          );
        }
      }

      logger.debug('GitHub API rate limit status:', {
        remaining,
        limit: data.rate.limit,
        resetTime: resetTime.toISOString()
      });
    } catch (error: any) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }
      
      logger.warn('Failed to check rate limit:', error.message);
      // Continue anyway - the actual API call will handle rate limiting
    }
  }

  /**
   * Detect programming language from file extension
   */
  detectLanguageFromExtension(filename: string): string {
    const ext = filename.toLowerCase().split('.').pop();
    
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'cpp',
      'h': 'cpp',
      'hpp': 'cpp',
      'cs': 'csharp',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
    };

    return languageMap[ext || ''] || 'text';
  }

  /**
   * Detect frameworks from repository files
   */
  detectFrameworks(files: GitHubFileTree[]): string[] {
    const frameworks = new Set<string>();
    const filePaths = files.map(f => f.path.toLowerCase());

    // Package.json based detection
    if (filePaths.includes('package.json')) {
      if (filePaths.some(p => p.includes('react'))) {
        frameworks.add('React');
      }
      if (filePaths.some(p => p.includes('vue'))) {
        frameworks.add('Vue.js');
      }
      if (filePaths.some(p => p.includes('angular'))) {
        frameworks.add('Angular');
      }
      if (filePaths.includes('next.config.js') || filePaths.includes('next.config.ts')) {
        frameworks.add('Next.js');
      }
      if (filePaths.includes('nuxt.config.js') || filePaths.includes('nuxt.config.ts')) {
        frameworks.add('Nuxt.js');
      }
      if (filePaths.includes('svelte.config.js') || filePaths.some(p => p.endsWith('.svelte'))) {
        frameworks.add('Svelte');
      }
      if (filePaths.includes('express') || filePaths.some(p => p.includes('app.js') || p.includes('server.js'))) {
        frameworks.add('Express.js');
      }
    }

    // Python frameworks
    if (filePaths.includes('requirements.txt') || filePaths.includes('pyproject.toml')) {
      if (filePaths.some(p => p.includes('django'))) {
        frameworks.add('Django');
      }
      if (filePaths.some(p => p.includes('flask'))) {
        frameworks.add('Flask');
      }
      if (filePaths.some(p => p.includes('fastapi'))) {
        frameworks.add('FastAPI');
      }
    }

    // Java frameworks
    if (filePaths.includes('pom.xml') || filePaths.includes('build.gradle')) {
      if (filePaths.some(p => p.includes('spring'))) {
        frameworks.add('Spring');
      }
    }

    // Other indicators
    if (filePaths.includes('dockerfile') || filePaths.includes('docker-compose.yml')) {
      frameworks.add('Docker');
    }

    return Array.from(frameworks);
  }

  /**
   * Map GitHub language to our ProgrammingLanguage enum
   */
  mapGitHubLanguage(githubLanguage: string | null): 'typescript' | 'javascript' | 'python' | 'java' | 'csharp' | 'cpp' | 'php' | 'ruby' | 'go' {
    if (!githubLanguage) return 'javascript';
    
    const languageMap: Record<string, any> = {
      'JavaScript': 'javascript',
      'TypeScript': 'typescript',
      'Python': 'python',
      'Java': 'java',
      'C#': 'csharp',
      'C++': 'cpp',
      'C': 'cpp',
      'PHP': 'php',
      'Ruby': 'ruby',
      'Go': 'go',
    };

    return languageMap[githubLanguage] || 'javascript';
  }

  /**
   * Validate repository access and basic checks
   */
  async validateRepository(githubUrl: string): Promise<{
    owner: string;
    repo: string;
    repository: GitHubRepository;
  }> {
    const { owner, repo } = this.parseGitHubUrl(githubUrl);
    const repository = await this.getRepository(owner, repo);

    // Basic validation
    if (repository.archived) {
      throw new BadRequestError('Cannot import from archived repository');
    }

    if (repository.disabled) {
      throw new BadRequestError('Repository is disabled');
    }

    if (repository.size > 500000) { // 500MB limit
      logger.warn('Large repository detected:', {
        repo: repository.fullName,
        size: repository.size
      });
    }

    return { owner, repo, repository };
  }
}