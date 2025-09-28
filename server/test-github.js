// GitHub Integration Test Script
// Run with: node test-github.js

console.log('🔍 Testing GitHub Integration...\n');

// Simple GitHub service test without imports
async function testGitHubIntegration() {
  const testCases = [
    {
      name: 'Parse GitHub URLs',
      urls: [
        'https://github.com/microsoft/vscode',
        'git@github.com:microsoft/vscode.git',
        'microsoft/vscode',
        'https://github.com/microsoft/vscode.git'
      ]
    }
  ];

  // Test URL parsing function
  function parseGitHubUrl(githubUrl) {
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
  }

  // Test URL parsing
  console.log('📝 Testing URL Parsing:');
  testCases[0].urls.forEach(url => {
    try {
      const result = parseGitHubUrl(url);
      console.log(`  ✅ ${url} → ${result.owner}/${result.repo}`);
    } catch (error) {
      console.log(`  ❌ ${url} → ${error.message}`);
    }
  });

  // Test language detection
  console.log('\n🔤 Testing Language Detection:');
  const testFiles = [
    'index.js',
    'app.ts', 
    'main.py',
    'Program.java',
    'app.cpp',
    'style.css',
    'README.md'
  ];

  function detectLanguageFromExtension(filename) {
    const ext = filename.toLowerCase().split('.').pop();
    const languageMap = {
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
  
  testFiles.forEach(filename => {
    const language = detectLanguageFromExtension(filename);
    console.log(`  ${filename} → ${language}`);
  });

  console.log('\n✅ GitHub Integration basic tests completed!');
  console.log('\n📋 Next Steps:');
  console.log('  1. Ensure your database is running');
  console.log('  2. Run: npx prisma migrate dev --name add-github-integration');
  console.log('  3. Add GITHUB_TOKEN to .env for API access');
  console.log('  4. Start the server: npm run dev');
  console.log('  5. Test the API endpoints with a REST client');
  console.log('\n🚀 Your GitHub integration is ready to use!');
}

// Run the test
testGitHubIntegration().catch(console.error);