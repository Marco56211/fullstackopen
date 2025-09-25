import { Octokit } from '@octokit/rest'
import { execSync } from 'child_process'

let connectionSettings;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
// Always call this function again to get a fresh client.
export async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

async function setupRepository() {
  try {
    console.log('Setting up GitHub repository connection...');
    
    const github = await getUncachableGitHubClient();
    const user = await github.rest.users.getAuthenticated();
    console.log(`Connected as: ${user.data.login}`);
    
    // Check if repository exists
    try {
      const repo = await github.rest.repos.get({
        owner: 'Marco56211',
        repo: 'fullstackopen'
      });
      console.log(`Repository found: ${repo.data.html_url}`);
    } catch (error) {
      if (error.status === 404) {
        console.log('Repository not found. Creating new repository...');
        const newRepo = await github.rest.repos.createForAuthenticatedUser({
          name: 'fullstackopen',
          description: 'Full Stack Open Course Projects',
          private: false
        });
        console.log(`Repository created: ${newRepo.data.html_url}`);
      } else {
        throw error;
      }
    }
    
    // Set up git configuration
    console.log('Configuring git...');
    execSync(`git config user.name "${user.data.name || user.data.login}"`);
    execSync(`git config user.email "${user.data.email || user.data.login + '@users.noreply.github.com'}"`);
    
    // Add remote origin
    try {
      execSync('git remote add origin https://github.com/Marco56211/fullstackopen.git');
      console.log('Remote origin added successfully');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('Remote origin already exists');
      } else {
        throw error;
      }
    }
    
    console.log('Repository setup complete!');
    
  } catch (error) {
    console.error('Error setting up repository:', error.message);
    process.exit(1);
  }
}

async function pushChanges() {
  try {
    console.log('Adding all changes...');
    execSync('git add .');
    
    console.log('Creating commit...');
    const timestamp = new Date().toISOString();
    execSync(`git commit -m "Update Full Stack Open projects - ${timestamp}"`);
    
    console.log('Pushing to GitHub...');
    execSync('git push -u origin main');
    
    console.log('Changes pushed successfully!');
    
  } catch (error) {
    console.error('Error pushing changes:', error.message);
    
    // If main branch doesn't exist, try master
    if (error.message.includes('main')) {
      try {
        console.log('Trying to push to master branch...');
        execSync('git push -u origin master');
        console.log('Changes pushed successfully to master!');
      } catch (masterError) {
        console.error('Error pushing to master:', masterError.message);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
}

// Main execution
async function main() {
  const command = process.argv[2];
  
  if (command === 'setup') {
    await setupRepository();
  } else if (command === 'push') {
    await pushChanges();
  } else {
    console.log('Usage:');
    console.log('  node github-sync.js setup  - Set up GitHub repository connection');
    console.log('  node github-sync.js push   - Push changes to GitHub');
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}