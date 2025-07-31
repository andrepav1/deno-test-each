#!/bin/bash

# Release script for deno-test-each
# Usage: ./release.sh <version>
# Example: ./release.sh 1.0.0

set -e

# Check if version argument is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <version>"
    echo "Example: $0 1.0.0"
    exit 1
fi

VERSION=$1

# Validate version format (basic semver check)
if ! [[ $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Version must be in format x.y.z (e.g., 1.0.0)"
    exit 1
fi

echo "🚀 Preparing release v$VERSION"

# Update version in deno.json
echo "📝 Updating deno.json..."
sed -i.bak "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" deno.json && rm deno.json.bak

# Update version in package.json
echo "📝 Updating package.json..." 
sed -i.bak "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" package.json && rm package.json.bak

# Run tests
echo "🧪 Running tests..."
deno test

# Check formatting and linting
echo "🔍 Checking code quality..."
deno fmt --check
deno lint

# Dry run publish to JSR
echo "🔍 Validating JSR publish..."
deno publish --dry-run

echo "✅ All checks passed!"

# Commit version changes
echo "📝 Committing version update..."
git add deno.json package.json
git commit -m "chore: bump version to v$VERSION

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Create and push tag
echo "🏷️  Creating tag v$VERSION..."
git tag -a "v$VERSION" -m "Release v$VERSION"

echo "📤 Pushing changes and tag..."
git push origin master
git push origin "v$VERSION"

echo "🎉 Version v$VERSION prepared!"
echo ""
echo "Next steps to complete the release:"
echo "  1. Publish to JSR: deno publish"
echo "  2. Build for NPM: deno task build"
echo "  3. Publish to NPM: cd npm && npm publish"
echo "  4. Create GitHub release: https://github.com/andrepav1/deno-test-each/releases/new?tag=v$VERSION"
echo ""
echo "JSR Package: https://jsr.io/@andrea/deno-test-each"
echo "NPM Package: https://npmjs.com/package/deno-test-each"