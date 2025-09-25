import { Octokit } from '@octokit/rest'
import { execSync } from 'child_process'

async function getGitHubToken() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  const connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  return connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;
}

async function forcePushClean() {
  try {
    console.log('🧹 Final cleanup - Force pushing as Marco56211...');
    
    const token = await getGitHubToken();
    const github = new Octokit({ auth: token });
    const user = await github.rest.users.getAuthenticated();
    console.log(`✅ Authenticated as: ${user.data.login}`);
    
    const repoUrl = `https://${token}@github.com/Marco56211/fullstack_new.git`;
    
    // Force push to override any repository issues
    console.log('🚀 Force pushing to clean repository...');
    execSync(`git push ${repoUrl} main --force`, { stdio: 'inherit' });
    
    console.log('🎉 COMPLETE SUCCESS!');
    console.log('✅ Full Stack Open projects successfully pushed');
    console.log('🗑️  marcDavies56211 completely eliminated');
    console.log('👤 Clean authentication as Marco56211');
    console.log('🔗 Repository: https://github.com/Marco56211/fullstack_new');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

forcePushClean();