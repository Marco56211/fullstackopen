import { Octokit } from '@octokit/rest'
import { execSync } from 'child_process'

async function getGitHubToken() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found');
  }

  const connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!accessToken) {
    throw new Error('GitHub token not found');
  }
  return accessToken;
}

async function pushAsMarco56211() {
  try {
    console.log('🧹 Removing ALL traces of marcDavies56211...');
    
    // Get GitHub token
    const token = await getGitHubToken();
    
    // Verify we're authenticated as Marco56211
    const github = new Octokit({ auth: token });
    const user = await github.rest.users.getAuthenticated();
    console.log(`✅ Authenticated as: ${user.data.login}`);
    
    if (user.data.login !== 'Marco56211') {
      throw new Error(`ERROR: Still connected as ${user.data.login}, not Marco56211!`);
    }
    
    console.log('🚀 Pushing to new repository with clean Marco56211 authentication...');
    
    // Create the authenticated URL for the new repository
    const repoUrl = `https://${token}@github.com/Marco56211/fullstack_new.git`;
    
    // Push directly using the token
    execSync(`git push ${repoUrl} main`, { stdio: 'inherit' });
    
    console.log('🎉 SUCCESS!');
    console.log('✅ All Full Stack Open projects pushed as Marco56211');
    console.log('🗑️  marcDavies56211 completely eliminated from authentication');
    console.log('🔗 Repository: https://github.com/Marco56211/fullstack_new');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

pushAsMarco56211();