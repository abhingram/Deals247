#!/bin/bash

echo "🔧 Fixing Deals247 Backend Production Issues"
echo "============================================"

# Change to server directory
cd /var/www/deals247/server

echo "1. Installing missing dependencies..."
npm install node-cron

echo "2. Checking environment file..."
if [ -f .env ]; then
    echo "✅ .env file exists"
    echo "DB_HOST: $(grep DB_HOST .env | cut -d'=' -f2)"
    echo "DB_USER: $(grep DB_USER .env | cut -d'=' -f2)"
    echo "DB_NAME: $(grep DB_NAME .env | cut -d'=' -f2)"
    echo "PORT: $(grep PORT .env | cut -d'=' -f2 || echo '5000')"
else
    echo "❌ .env file missing!"
fi

echo "3. Testing database connection..."
node -e "
const mysql = require('mysql2/promise');
require('dotenv').config();
async function test() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306
    });
    console.log('✅ Database connection successful');
    await conn.end();
  } catch(e) {
    console.error('❌ Database connection failed:', e.message);
    process.exit(1);
  }
}
test();
"

if [ $? -eq 0 ]; then
    echo "4. Restarting PM2 process..."
    pm2 restart deals247-backend
    pm2 logs deals247-backend --lines 10
else
    echo "❌ Database connection failed - check credentials and MySQL server"
fi

echo "5. Checking server status..."
sleep 3
curl -s http://localhost:5000/api/health || echo "❌ Server not responding on port 5000"</content>
<parameter name="filePath">D:\Repos\Pet Projects\Deals247\fix-backend-issues.sh