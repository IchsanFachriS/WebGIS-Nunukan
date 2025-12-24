#!/bin/bash

# Quick Deploy Script untuk WebGIS Mangrove Nunukan
# Script ini membantu proses deployment ke GitHub Pages

echo "=================================================="
echo "🚀 WebGIS Mangrove Nunukan - Quick Deploy"
echo "=================================================="
echo ""

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fungsi untuk print dengan warna
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# 1. Cek apakah di dalam git repository
echo "1. Checking Git repository..."
if [ ! -d .git ]; then
    print_error "Not a git repository. Initializing git..."
    git init
    print_success "Git initialized"
else
    print_success "Git repository found"
fi

# 2. Cek file penting
echo ""
echo "2. Checking required files..."

if [ ! -f "vite.config.ts" ]; then
    print_error "vite.config.ts not found!"
    exit 1
else
    print_success "vite.config.ts found"
fi

if [ ! -f "package.json" ]; then
    print_error "package.json not found!"
    exit 1
else
    print_success "package.json found"
fi

if [ ! -f "public/data/mangrove.geojson" ]; then
    print_warning "public/data/mangrove.geojson not found!"
    print_info "Please add your GeoJSON file to public/data/"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    print_success "GeoJSON file found"
fi

if [ ! -d ".github/workflows" ]; then
    print_warning "GitHub Actions workflow not found"
    print_info "Creating .github/workflows directory..."
    mkdir -p .github/workflows
    print_success "Directory created"
fi

if [ ! -f ".github/workflows/deploy.yml" ]; then
    print_warning "deploy.yml not found"
    print_info "Please create .github/workflows/deploy.yml"
fi

# 3. Install dependencies
echo ""
echo "3. Installing dependencies..."
if npm install; then
    print_success "Dependencies installed"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# 4. Test build
echo ""
echo "4. Testing build..."
if npm run build; then
    print_success "Build successful"
else
    print_error "Build failed. Please fix errors before deploying."
    exit 1
fi

# 5. Ask for repository URL
echo ""
echo "5. Git remote configuration..."
if git remote get-url origin > /dev/null 2>&1; then
    CURRENT_REMOTE=$(git remote get-url origin)
    print_info "Current remote: $CURRENT_REMOTE"
    read -p "Keep this remote? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter GitHub repository URL: " REPO_URL
        git remote set-url origin "$REPO_URL"
        print_success "Remote updated"
    fi
else
    read -p "Enter GitHub repository URL: " REPO_URL
    git remote add origin "$REPO_URL"
    print_success "Remote added"
fi

# 6. Get current branch
CURRENT_BRANCH=$(git branch --show-current)
if [ -z "$CURRENT_BRANCH" ]; then
    CURRENT_BRANCH="main"
    git checkout -b main
fi
print_info "Current branch: $CURRENT_BRANCH"

# 7. Add and commit files
echo ""
echo "6. Committing changes..."
git add .

read -p "Enter commit message (or press Enter for default): " COMMIT_MSG
if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="Deploy WebGIS Mangrove Nunukan to GitHub Pages"
fi

if git commit -m "$COMMIT_MSG"; then
    print_success "Changes committed"
else
    print_warning "Nothing to commit or commit failed"
fi

# 8. Push to GitHub
echo ""
echo "7. Pushing to GitHub..."
read -p "Push to GitHub now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if git push -u origin "$CURRENT_BRANCH"; then
        print_success "Pushed to GitHub successfully"
    else
        print_error "Push failed. Please check your credentials and repository permissions."
        exit 1
    fi
else
    print_info "Skipped push. You can push manually with: git push -u origin $CURRENT_BRANCH"
fi

# 9. Final instructions
echo ""
echo "=================================================="
echo "🎉 Deployment preparation complete!"
echo "=================================================="
echo ""
print_info "Next steps:"
echo "1. Go to your GitHub repository"
echo "2. Click Settings → Pages"
echo "3. Under 'Source', select 'GitHub Actions'"
echo "4. Wait for deployment to complete (check Actions tab)"
echo "5. Your site will be available at:"
echo "   https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/"
echo ""
print_success "Done! Good luck! 🚀"