#!/bin/bash

# ============================================================================
# Deals247 - Hostinger VPS Deployment Script
# ============================================================================
# Domain: deals247.online
# Database: Hostinger MySQL Remote Database
# 
# This script will:
# 1. Install all required software
# 2. Clone and configure the application
# 3. Setup the database
# 4. Configure Nginx as reverse proxy
# 5. Setup SSL with Let's Encrypt
# 6. Start the application with PM2
# ============================================================================

set -e  # Exit on any error

echo "🚀 Deals247 Deployment Script for Hostinger VPS"
echo "================================================"
echo ""

# ============================================================================
# STEP 1: Update System
# ============================================================================
echo "📦 Step 1: Updating system packages..."
echo "======================================="
sudo apt update
sudo apt upgrade -y
echo "✅ System updated"
echo ""

# ============================================================================
# STEP 2: Install Node.js 20.x
# ============================================================================
echo "📦 Step 2: Installing Node.js 20.x..."
echo "======================================"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "✅ Node.js installed"
echo ""

# ============================================================================
# STEP 3: Install Required Packages
# ============================================================================
echo "📦 Step 3: Installing required packages..."
echo "==========================================="
sudo apt install -y nginx git build-essential mysql-client
echo "✅ Packages installed"
echo ""

# ============================================================================
# STEP 4: Install PM2
# ============================================================================
echo "📦 Step 4: Installing PM2..."
echo "============================"
sudo npm install -g pm2
echo "PM2 version: $(pm2 --version)"
echo "✅ PM2 installed"
echo ""

# ============================================================================
# STEP 5: Clone Application
# ============================================================================
echo "📂 Step 5: Cloning application..."
echo "=================================="
cd /var/www

if [ -d "deals247" ]; then
    echo "Directory exists. Removing old installation..."
    sudo rm -rf deals247
fi

sudo git clone https://github.com/abhingram/Deals247.git deals247
sudo chown -R $USER:$USER /var/www/deals247
cd /var/www/deals247

echo "✅ Application cloned"
echo ""

# ============================================================================
# STEP 6: Configure Backend Environment
# ============================================================================
echo "⚙️  Step 6: Configuring backend environment..."
echo "=============================================="
cat > /var/www/deals247/server/.env << 'EOF'
# Server Configuration
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://deals247.online

# Database Configuration (Hostinger Remote MySQL)
DB_HOST=${DB_HOST:-srv994.hstgr.io}
DB_PORT=${DB_PORT:-3306}
DB_NAME=${DB_NAME:-u515501238_deals247_db}
DB_USER=${DB_USER:-u515501238_deals247_user}
DB_PASSWORD=${DB_PASSWORD}

# JWT Configuration
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=https://deals247.online,http://deals247.online
EOF

echo "✅ Backend environment configured"
echo ""

# ============================================================================
# STEP 7: Install Dependencies and Build
# ============================================================================
echo "📦 Step 7: Installing dependencies and building..."
echo "=================================================="
cd /var/www/deals247

echo "Installing root dependencies..."
npm install

echo "Building frontend..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ ERROR: Build failed - dist directory not created"
    exit 1
fi

echo "✅ Dependencies installed and application built"
echo ""

# ============================================================================
# STEP 8: Test Database Connection
# ============================================================================
echo "🗄️  Step 8: Testing database connection..."
echo "=========================================="
if [ -z "$DB_PASSWORD" ]; then
  echo "❌ ERROR: DB_PASSWORD not set. Export DB_PASSWORD before running this script or pass it in the environment."
  exit 1
fi

mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "SELECT 'Connection successful' as status;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database connection successful"
else
    echo "❌ ERROR: Cannot connect to database"
    echo "Please verify database credentials and network access (Hostinger may require whitelist for remote MySQL)."
    exit 1
fi
echo ""

# ============================================================================
# STEP 9: Import Database Schemas
# ============================================================================
echo "🗄️  Step 9: Importing database schemas..."
echo "========================================="
cd /var/www/deals247

echo "Importing main schema..."
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < server/database/schema.sql

echo "Importing business schema..."
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < server/database/business_schema.sql

echo "Importing notifications schema..."
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < server/database/notifications_schema.sql

echo "✅ Database schemas imported"
echo ""

# ============================================================================
# STEP 10: Start Backend with PM2
# ============================================================================
echo "🚀 Step 10: Starting backend with PM2..."
echo "========================================"
cd /var/www/deals247

# Stop and delete existing instance if any
pm2 stop deals247-backend 2>/dev/null || true
pm2 delete deals247-backend 2>/dev/null || true

# Start the application
pm2 start server/index.js --name deals247-backend --time

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME

echo "✅ Backend started with PM2"
pm2 status
echo ""

# ============================================================================
# STEP 11: Configure Nginx
# ============================================================================
echo "🌐 Step 11: Configuring Nginx..."
echo "================================"
sudo tee /etc/nginx/sites-available/deals247 > /dev/null << 'NGINXCONF'
server {
    listen 80;
    listen [::]:80;
    server_name deals247.online www.deals247.online;
    
    # For Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/deals247/dist;
    }
    
    # Application root
    root /var/www/deals247/dist;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json image/svg+xml;

    # API proxy to backend (port 5000)
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeouts for long-running requests
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Frontend - SPA routing (React Router)
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Don't cache HTML files
        location ~* \.html$ {
            expires -1;
            add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
        }
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
NGINXCONF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/deals247 /etc/nginx/sites-enabled/

# Remove default site if exists
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

if [ $? -eq 0 ]; then
    sudo systemctl restart nginx
    sudo systemctl enable nginx
    echo "✅ Nginx configured and started"
else
    echo "❌ ERROR: Nginx configuration failed"
    exit 1
fi
echo ""

# ============================================================================
# STEP 12: Configure Firewall
# ============================================================================
echo "🔥 Step 12: Configuring firewall..."
echo "==================================="
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
echo "y" | sudo ufw enable
sudo ufw status
echo "✅ Firewall configured"
echo ""

# ============================================================================
# STEP 13: Setup SSL Certificate
# ============================================================================
echo "🔐 Step 13: Setting up SSL certificate..."
echo "========================================="
sudo apt install -y certbot python3-certbot-nginx

echo ""
echo "⚠️  IMPORTANT: Make sure your domain DNS is pointed to this server's IP!"
echo "Press Enter to continue with SSL setup, or Ctrl+C to cancel..."
read

# Use CERTBOT_EMAIL env var if set, otherwise prompt
CERT_EMAIL=${CERT_EMAIL:-admin@deals247.online}

sudo certbot --nginx -d deals247.online -d www.deals247.online --non-interactive --agree-tos --email "$CERT_EMAIL" --redirect

if [ $? -eq 0 ]; then
    echo "✅ SSL certificate installed"
    
    # Test auto-renewal
    sudo certbot renew --dry-run
    echo "✅ SSL auto-renewal configured"
else
    echo "⚠️  SSL setup failed. You can run it manually later:"
    echo "sudo certbot --nginx -d deals247.online -d www.deals247.online"
fi
echo ""

# ============================================================================
# DEPLOYMENT COMPLETE
# ============================================================================
echo ""
echo "════════════════════════════════════════════════════════"
echo "🎉 DEPLOYMENT COMPLETE! 🎉"
echo "════════════════════════════════════════════════════════"
echo ""
echo "Your Deals247 application is now live!"
echo ""
echo "🌍 Website URLs:"
echo "   HTTP:  http://deals247.online"
echo "   HTTPS: https://deals247.online"
echo ""
echo "🔌 API Endpoint:"
echo "   https://deals247.online/api"
echo ""
echo "📊 Useful Commands:"
echo "   pm2 status                    - Check backend status"
echo "   pm2 logs deals247-backend     - View backend logs"
echo "   pm2 restart deals247-backend  - Restart backend"
echo "   sudo systemctl status nginx   - Check Nginx status"
echo "   sudo systemctl restart nginx  - Restart Nginx"
echo ""
echo "📝 Next Steps:"
echo "   1. Add 'deals247.online' to Firebase authorized domains"
echo "   2. Test user registration and login"
echo "   3. Create admin user (if needed)"
echo "   4. Add some test deals"
echo ""
echo "🔍 Verify Deployment:"
echo "   curl http://localhost:5000/api/health"
echo "   curl https://deals247.online/api/health"
echo ""
echo "════════════════════════════════════════════════════════"
