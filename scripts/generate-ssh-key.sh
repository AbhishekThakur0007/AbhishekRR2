#!/bin/bash

# Script to generate an SSH key for Hetzner Cloud

echo "This script will generate an SSH key pair for use with Hetzner Cloud."
echo "The public key should be added to your Hetzner Cloud account with the name 'github-actions'."
echo ""

# Generate key
SSH_KEY_NAME="github-actions"
SSH_KEY_FILE="$HOME/.ssh/${SSH_KEY_NAME}"

if [ -f "$SSH_KEY_FILE" ]; then
    echo "SSH key already exists at $SSH_KEY_FILE"
    read -p "Do you want to overwrite it? (y/n): " OVERWRITE
    if [ "$OVERWRITE" != "y" ]; then
        echo "Aborted."
        exit 0
    fi
fi

echo "Generating SSH key..."
ssh-keygen -t ed25519 -f "$SSH_KEY_FILE" -N "" -C "github-actions"

echo ""
echo "SSH key generated successfully!"
echo "Public key: $SSH_KEY_FILE.pub"
echo ""
echo "Public key content (copy this to Hetzner Cloud):"
echo "----------------------------------------------"
cat "$SSH_KEY_FILE.pub"
echo "----------------------------------------------"
echo ""
echo "Next steps:"
echo "1. Log in to your Hetzner Cloud Console"
echo "2. Go to 'Security' > 'SSH Keys'"
echo "3. Add a new SSH key with the name 'github-actions' and paste the public key above"
echo "4. Make sure your GitHub repository has the HETZNER_API_TOKEN secret set"