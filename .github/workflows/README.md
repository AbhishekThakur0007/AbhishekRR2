# CI/CD Workflow Setup

This repository uses GitHub Actions for continuous integration and deployment to both Vercel and Hetzner Cloud.

## Required Secrets

To make the CI/CD workflow function properly, you need to add the following secrets to your GitHub repository.

> **Helper Scripts**: We've included two scripts to help you set up the required secrets and SSH keys:
> - `scripts/setup-secrets.sh`: Helps you set up the GitHub repository secrets using the GitHub CLI
> - `scripts/generate-ssh-key.sh`: Generates an SSH key pair for use with Hetzner Cloud

### For Vercel Deployment
- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

You can obtain these values by:
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel login` and authenticate
3. Run `vercel link` in your project directory
4. The `.vercel` directory will contain a `project.json` file with your `orgId` and `projectId`
5. Generate a token from the Vercel dashboard under Account Settings > Tokens

### For Hetzner Cloud Deployment
- `HETZNER_API_TOKEN`: Your Hetzner Cloud API token

You can obtain this token by:
1. Log in to your Hetzner Cloud Console
2. Go to "Security" > "API Tokens"
3. Create a new token with appropriate permissions (read & write)

### SSH Key Setup for Hetzner
The workflow uses an SSH key named "github-actions" to connect to the Hetzner server. You need to:

1. Generate an SSH key pair
2. Add the public key to your Hetzner Cloud account under "Security" > "SSH Keys" with the name "github-actions"

## How the Workflow Works

1. **Build and Test**: Runs on all pushes and pull requests to main/master branches
   - Checks out code
   - Sets up Node.js
   - Installs dependencies
   - Runs linting
   - Builds the application
   - Uploads build artifacts

2. **Deploy to Vercel**: Runs only on pushes to main/master
   - Deploys the application to Vercel using the Vercel CLI

3. **Deploy to Hetzner Cloud**: Runs only on pushes to main/master
   - Creates a new server on Hetzner Cloud
   - Runs a startup script that:
     - Updates the system
     - Installs Node.js and other dependencies
     - Clones the repository
     - Builds and starts the application
     - Configures Nginx as a reverse proxy

## Customization

You can customize the workflow by editing the `.github/workflows/cicd.yml` file. Common customizations include:

- Changing the server type in Hetzner (currently set to `cx11`)
- Modifying the startup script to include additional setup steps
- Adding environment variables to the deployments