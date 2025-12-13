#!/bin/bash

# Deals247 - Custom Deployment Script for Hostinger VPS
# Domain: deals247.online
# Database: Hostinger MySQL (srv994.hstgr.io)

set -e  # Exit on any error

echo "🚀 Starting Deals247 Deployment on Hostinger VPS"
echo "=================================================="

# Configuration
DOMAIN="deals247.online"
VPS_IP="YOUR_VPS_IP"  # You'll get this from Hostinger
APP_DIR="/var/www/deals247"
GITHUB_REPO="https://github.com/abhingram/deals247online.git"

echo ""
echo "📋 Step 1: System Update & Install Dependencies"
echo "================================================"
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
echo "Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install required packages
echo "Installing required packages..."
    sudo apt install -y nginx git build-essential

# Install PM2 globally
echo "Installing PM2..."
sudo npm install -g pm2

# Verify installations
echo "Verifying installations..."
node --version
npm --version
pm2 --version

echo ""
echo "✅ Step 1 Complete - All dependencies installed"
echo ""

echo "📂 Step 2: Clone Application"
echo "============================"
cd /var/www
if [ -d "$APP_DIR" ]; then
    echo "Directory exists, pulling latest changes..."
    cd $APP_DIR
    git pull origin main
else
    echo "Cloning repository..."
    sudo git clone $GITHUB_REPO deals247
    sudo chown -R $USER:$USER $APP_DIR
    cd $APP_DIR
fi

echo "✅ Step 2 Complete - Application cloned"
echo ""

echo "⚙️  Step 3: Configure Environment Variables"
echo "=========================================="
# Create backend .env
cat > server/.env << 'EOF'
# Server Configuration
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://deals247.online

# Database Configuration (Hostinger MySQL)
DB_HOST=srv994.hstgr.io
DB_HOST_IP=193.203.166.226
DB_PORT=3306
DB_NAME=u515501238_deals247_db
DB_USER=u515501238_deals247_user
DB_PASSWORD=2ap5HYzh5@R8&Cq

# JWT Configuration
JWT_SECRET=deals247-super-secret-jwt-key-change-this-for-security
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=https://deals247.online,http://deals247.online
EOF

# Frontend .env is already in .env.production
echo "✅ Step 3 Complete - Environment configured"
echo ""

echo "📦 Step 4: Install Dependencies & Build"
echo "======================================"
npm install
npm run build

# Verify build
if [ ! -d "dist" ]; then
    echo "❌ Build failed - dist directory not created"
    exit 1
fi

echo "✅ Step 4 Complete - Application built successfully"
echo ""

echo "🗄️  Step 5: Initialize Database"
echo "=============================="
echo "Testing database connection..."
mysql -h srv994.hstgr.io -u u515501238_deals247_user -p'2ap5HYzh5@R8&Cq' u515501238_deals247_db -e "SELECT 1;" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Database connection successful"
    
    echo "Importing database schemas..."
    mysql -h srv994.hstgr.io -u u515501238_deals247_user -p'2ap5HYzh5@R8&Cq' u515501238_deals247_db < server/database/schema.sql
    mysql -h srv994.hstgr.io -u u515501238_deals247_user -p'2ap5HYzh5@R8&Cq' u515501238_deals247_db < server/database/business_schema.sql
    mysql -h srv994.hstgr.io -u u515501238_deals247_user -p'2ap5HYzh5@R8&Cq' u515501238_deals247_db < server/database/notifications_schema.sql
    
    echo "✅ Database schemas imported successfully"
else
    echo "❌ Database connection failed. Please check credentials."
    exit 1
fi
echo ""

echo "🚀 Step 6: Start Backend with PM2"
echo "================================"
pm2 stop deals247-backend 2>/dev/null || true
pm2 delete deals247-backend 2>/dev/null || true
pm2 start server/index.js --name deals247-backend
pm2 save
pm2 startup systemd -u $USER --hp /home/$USER

echo "✅ Step 6 Complete - Backend started"
echo ""

echo "🌐 Step 7: Configure Nginx"
echo "========================="
sudo tee /etc/nginx/sites-available/deals247 > /dev/null << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name deals247.online www.deals247.online;
    
    # Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/deals247/dist;
    }
    
    # Root directory for frontend
    root /var/www/deals247/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

    # API proxy to backend
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
    }

    # Frontend - SPA routing
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Security
    location ~ /\. {
        deny all;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/deals247 /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
sudo nginx -t
if [ $? -eq 0 ]; then
    sudo systemctl restart nginx
    sudo systemctl enable nginx
    echo "✅ Nginx configured and restarted"
else
    echo "❌ Nginx configuration error"
    exit 1
fi
echo ""

echo "🔥 Step 8: Configure Firewall"
echo "============================"
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
echo "y" | sudo ufw enable
sudo ufw status

echo "✅ Step 8 Complete - Firewall configured"
echo ""

echo "🔐 Step 9: Setup SSL Certificate"
echo "================================"
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d deals247.online -d www.deals247.online --non-interactive --agree-tos --email D247Online@outlook.com

echo "✅ Step 9 Complete - SSL configured"
echo ""

echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================"
echo ""
echo "Your application is now deployed at:"
echo "🌍 HTTP:  http://deals247.online"
echo "🔒 HTTPS: https://deals247.online"
echo ""
echo "Backend API: https://deals247.online/api"
echo ""
echo "Useful commands:"
echo "  pm2 status                 - Check backend status"
echo "  pm2 logs deals247-backend  - View backend logs"
echo "  sudo systemctl status nginx - Check Nginx status"
echo ""
echo "Next steps:"
echo "1. Point your domain DNS to VPS IP: $VPS_IP"
echo "2. Add deals247.online to Firebase authorized domains"
echo "3. Test the application"
echo "4. Create admin user if needed"
echo ""
echo "📝 Remember to update $VPS_IP in this script with your actual VPS IP!"
