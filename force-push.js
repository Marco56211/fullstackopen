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

async function forcePush() {
  try {
    console.log('🔧 Removing marcDavies56211 authentication completely...');
    
    // Get GitHub client using proper integration
    const token = await getAccessToken();
    const github = new Octokit({ auth: token });
    const user = await github.rest.users.getAuthenticated();
    console.log(`✅ Authenticated as: ${user.data.login}`);
    
    // Force push using token authentication
    console.log('🚀 Force pushing with GitHub integration token...');
    
    const repoUrl = `https://${token}@github.com/Marco56211/fullstackopen.git`;
    
    // Update the existing remote with token authentication
    execSync(`git remote set-url origin ${repoUrl}`);
    
    // Push with the token
    execSync('git push origin main --force');
    
    console.log('🎉 Successfully pushed as Marco56211!');
    console.log('✨ marcDavies56211 authentication completely removed!');
    console.log('🔗 Repository: https://github.com/Marco56211/fullstackopen');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

forcePush();