#!/bin/bash

# Script to help set up GitHub repository secrets for CI/CD

echo "This script will help you set up the required secrets for the CI/CD workflow."
echo "You will need:"
echo "  - A GitHub personal access token with 'repo' scope"
echo "  - Your Vercel token, organization ID, and project ID"
echo "  - Your Hetzner Cloud API token"
echo ""
echo "Make sure you have the GitHub CLI (gh) installed and authenticated."
echo ""

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI (gh) is not installed. Please install it first:"
    echo "  https://cli.github.com/manual/installation"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "You are not authenticated with GitHub CLI. Please run 'gh auth login' first."
    exit 1
fi

# Get repository name
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
if [ -z "$REPO" ]; then
    echo "Could not determine repository name. Please run this script from within the repository."
    exit 1
fi

echo "Setting up secrets for repository: $REPO"
echo ""

# Vercel secrets
read -p "Enter your Vercel token: " VERCEL_TOKEN
read -p "Enter your Vercel organization ID: " VERCEL_ORG_ID
read -p "Enter your Vercel project ID: " VERCEL_PROJECT_ID

# Hetzner secret
read -p "Enter your Hetzner Cloud API token: " HETZNER_API_TOKEN

# Set secrets
echo "Setting up secrets..."

gh secret set VERCEL_TOKEN -b"$VERCEL_TOKEN" -R "$REPO"
gh secret set VERCEL_ORG_ID -b"$VERCEL_ORG_ID" -R "$REPO"
gh secret set VERCEL_PROJECT_ID -b"$VERCEL_PROJECT_ID" -R "$REPO"
gh secret set HETZNER_API_TOKEN -b"$HETZNER_API_TOKEN" -R "$REPO"

echo ""
echo "Secrets have been set up successfully!"
echo ""
echo "Next steps:"
echo "1. Generate an SSH key pair for Hetzner Cloud"
echo "2. Add the public key to your Hetzner Cloud account with the name 'github-actions'"
echo "3. Push your code to GitHub to trigger the workflow"