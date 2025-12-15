#!/bin/bash

# Deals247 Update Deployment Script
# Run this script to update the application after code changes

set -e

echo "🔄 Deals247 Update Deployment Script"
echo "===================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

APP_DIR="/var/www/deals247"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root or with sudo
if [[ $EUID -ne 0 ]]; then
    print_error "This script must be run with sudo privileges"
    exit 1
fi

cd $APP_DIR

print_status "Pulling latest changes from git..."
git pull origin main

print_status "Installing updated dependencies..."
npm install

print_status "Building frontend..."
npm run build

if [ ! -d "dist" ]; then
    print_error "Build failed - dist directory not created"
    exit 1
fi

print_status "Installing server dependencies..."
cd server
npm install
cd ..

print_status "Restarting application with PM2..."
pm2 restart deals247-backend

print_status "Waiting for application to start..."
sleep 5

print_status "Checking application health..."
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    print_status "✅ Application is healthy"
else
    print_warning "⚠️  Application health check failed - please check logs"
fi

print_status "Reloading Nginx..."
systemctl reload nginx

print_status "✅ Update deployment completed!"
print_status ""
print_status "Application URLs:"
print_status "  Web: https://deals247.online"
print_status "  API: https://deals247.online/api"
print_status ""
print_status "Check status with: pm2 status"