import { Octokit } from '@octokit/rest'
import { spawn, execSync } from 'child_process'
import { unlinkSync, existsSync } from 'fs'

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

export async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

async function syncToGitHub() {
  try {
    console.log('🔄 Starting GitHub sync...');
    
    // Clear any git lock files
    const lockFiles = ['.git/index.lock', '.git/config.lock', '.git/HEAD.lock'];
    lockFiles.forEach(lockFile => {
      if (existsSync(lockFile)) {
        console.log(`🔓 Removing lock file: ${lockFile}`);
        unlinkSync(lockFile);
      }
    });
    
    // Get GitHub client
    const github = await getUncachableGitHubClient();
    const user = await github.rest.users.getAuthenticated();
    console.log(`✅ Connected as: ${user.data.login}`);
    
    // Check current status
    console.log('📋 Checking git status...');
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    
    if (status.trim() === '') {
      console.log('✨ No changes to commit');
      return;
    }
    
    console.log('📝 Changes detected:');
    console.log(status);
    
    // Add all changes
    console.log('➕ Adding changes...');
    execSync('git add .');
    
    // Create commit with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const commitMessage = `Update Full Stack Open projects - ${timestamp}`;
    console.log(`💾 Committing: "${commitMessage}"`);
    execSync(`git commit -m "${commitMessage}"`);
    
    // Push to GitHub
    console.log('🚀 Pushing to GitHub...');
    
    // Try main branch first, then master
    try {
      execSync('git push origin main');
      console.log('✅ Successfully pushed to main branch!');
    } catch (error) {
      try {
        execSync('git push origin master');
        console.log('✅ Successfully pushed to master branch!');
      } catch (masterError) {
        // Try creating and pushing main branch
        try {
          execSync('git branch -M main');
          execSync('git push -u origin main');
          console.log('✅ Successfully created and pushed main branch!');
        } catch (finalError) {
          throw finalError;
        }
      }
    }
    
    console.log('🎉 Sync completed successfully!');
    console.log('🔗 Repository: https://github.com/Marco56211/fullstackopen');
    
  } catch (error) {
    console.error('❌ Error during sync:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  syncToGitHub();
}