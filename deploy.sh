#!/bin/bash

# ========================================
# VisualDocs Deployment Script
# ========================================
# Run this on your DigitalOcean server
# Usage: chmod +x deploy.sh && ./deploy.sh

set -e  # Exit on error

echo "🚀 Starting VisualDocs Deployment..."

# Configuration
APP_DIR="/var/www/visualdocs"
REPO_URL="https://github.com/Bhavyabhardwaj/VisualDocs.git"
BRANCH="main"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    print_warning "Running without root privileges. Some commands may fail."
fi

# Step 1: Update system packages
echo ""
echo "📦 Step 1: Updating system packages..."
sudo apt update && sudo apt upgrade -y
print_status "System packages updated"

# Step 2: Install Node.js 20.x if not installed
echo ""
echo "📦 Step 2: Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "Installing Node.js 20.x..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi
node_version=$(node -v)
print_status "Node.js version: $node_version"

# Step 3: Install PM2 globally
echo ""
echo "📦 Step 3: Installing PM2..."
sudo npm install -g pm2
print_status "PM2 installed"

# Step 4: Install Nginx if not installed
echo ""
echo "📦 Step 4: Checking Nginx..."
if ! command -v nginx &> /dev/null; then
    sudo apt install -y nginx
fi
print_status "Nginx is installed"

# Step 5: Clone or pull the repository
echo ""
echo "📥 Step 5: Setting up application directory..."
if [ -d "$APP_DIR" ]; then
    echo "Pulling latest changes..."
    cd $APP_DIR
    git fetch origin
    git reset --hard origin/$BRANCH
else
    echo "Cloning repository..."
    sudo mkdir -p $APP_DIR
    sudo chown $USER:$USER $APP_DIR
    git clone -b $BRANCH $REPO_URL $APP_DIR
    cd $APP_DIR
fi
print_status "Repository is up to date"

# Step 6: Install server dependencies and build
echo ""
echo "🔧 Step 6: Building server..."
cd $APP_DIR/server
npm install
npm run build
print_status "Server built successfully"

# Step 7: Run Prisma migrations
echo ""
echo "🗄️ Step 7: Running database migrations..."
npx prisma generate
npx prisma migrate deploy
print_status "Database migrations complete"

# Step 8: Install client dependencies and build
echo ""
echo "🔧 Step 8: Building client..."
cd $APP_DIR/client
npm install
npm run build
print_status "Client built successfully"

# Step 9: Setup Nginx
echo ""
echo "🌐 Step 9: Configuring Nginx..."
sudo cp $APP_DIR/nginx.conf /etc/nginx/sites-available/visualdocs
sudo ln -sf /etc/nginx/sites-available/visualdocs /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
print_status "Nginx configured"

# Step 10: Setup SSL with Certbot
echo ""
echo "🔒 Step 10: Setting up SSL certificates..."
if ! command -v certbot &> /dev/null; then
    sudo apt install -y certbot python3-certbot-nginx
fi
echo ""
print_warning "Run these commands manually to get SSL certificates:"
echo "  sudo certbot --nginx -d visualdocs.bhavya.live -d www.visualdocs.bhavya.live"
echo "  sudo certbot --nginx -d api.visualdocs.bhavya.live"

# Step 11: Start the application with PM2
echo ""
echo "🚀 Step 11: Starting application with PM2..."
cd $APP_DIR
pm2 delete visualdocs-api 2>/dev/null || true
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
print_status "Application started with PM2"

# Step 12: Create logs directory
echo ""
echo "📝 Step 12: Setting up logs..."
mkdir -p $APP_DIR/logs
mkdir -p $APP_DIR/server/logs
print_status "Logs directory created"

# Done!
echo ""
echo "========================================="
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "========================================="
echo ""
echo "📋 Next Steps:"
echo "1. Copy your .env.production to $APP_DIR/server/.env"
echo "2. Update the .env file with your production credentials"
echo "3. Run SSL setup: sudo certbot --nginx -d visualdocs.bhavya.live -d api.visualdocs.bhavya.live"
echo "4. Update OAuth callback URLs in Google/GitHub to use https://api.visualdocs.bhavya.live"
echo "5. Restart the server: pm2 restart visualdocs-api"
echo ""
echo "📊 Useful commands:"
echo "  pm2 status          - Check app status"
echo "  pm2 logs            - View logs"
echo "  pm2 restart all     - Restart app"
echo "  sudo nginx -t       - Test nginx config"
echo ""
echo "🌐 Your app will be live at:"
echo "  Frontend: https://visualdocs.bhavya.live"
echo "  Backend:  https://api.visualdocs.bhavya.live"
echo ""
