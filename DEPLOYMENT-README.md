# Deals247 Deployment Guide

This guide covers deploying Deals247 to a VPS (Virtual Private Server) with full production setup.

## Prerequisites

- Ubuntu/Debian-based VPS (recommended: 2GB RAM, 1 CPU, 20GB SSD)
- Root or sudo access
- Domain name pointed to your VPS IP
- SSH access to your server

## Quick Deployment

### Option 1: Automated Deployment (Recommended)

1. **SSH into your VPS:**
   ```bash
   ssh root@your-vps-ip
   ```

2. **Download and run the deployment script:**
   ```bash
   wget https://raw.githubusercontent.com/abhingram/deals247online/main/deploy-vps.sh
   chmod +x deploy-vps.sh
   sudo ./deploy-vps.sh
   ```

3. **Follow the on-screen instructions** - the script will handle everything automatically.

### Option 2: Manual Deployment

If you prefer manual setup or need customization:

1. **Update system and install dependencies:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs nginx git build-essential mysql-client
   ```

2. **Clone and setup application:**
   ```bash
   cd /var/www
   sudo git clone https://github.com/abhingram/deals247online.git deals247
   cd deals247
   npm install
   npm run build
   ```

3. **Configure environment:**
   ```bash
   # Edit server/.env with your database and service credentials
   nano server/.env
   ```

4. **Setup database:**
   ```bash
   # Import schemas
   mysql -h your-db-host -u your-db-user -p your-db-name < server/database/schema.sql
   ```

5. **Start with PM2:**
   ```bash
   sudo npm install -g pm2
   pm2 start server/index.js --name deals247-backend
   pm2 save
   pm2 startup
   ```

6. **Configure Nginx:**
   ```bash
   # Copy the nginx config from deploy-vps.sh
   sudo nano /etc/nginx/sites-available/deals247
   sudo ln -s /etc/nginx/sites-available/deals247 /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

7. **Setup SSL:**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

## Post-Deployment Configuration

### Environment Variables

Update your `server/.env` file with production values:

```bash
# Database
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name

# Services
JWT_SECRET=your-secure-jwt-secret
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Database Setup

The deployment script automatically imports these schemas:
- `server/database/schema.sql` - Main application schema
- `server/database/business_schema.sql` - Business logic tables
- `server/database/notifications_schema.sql` - Notification system

### SSL Certificate

The script automatically sets up Let's Encrypt SSL certificates. To renew manually:
```bash
sudo certbot renew
```

## Updating the Application

After pushing code changes to the repository:

### Automated Updates
```bash
# On your VPS
cd /var/www/deals247
sudo ./update-deployment.sh
```

### Manual Updates
```bash
cd /var/www/deals247
git pull origin main
npm install
npm run build
cd server && npm install
pm2 restart deals247-backend
sudo systemctl reload nginx
```

## Monitoring & Maintenance

### Check Application Status
```bash
# PM2 status
pm2 status
pm2 logs deals247-backend

# Nginx status
sudo systemctl status nginx

# Check if services are responding
curl https://yourdomain.com/api/health
```

### Logs
```bash
# Application logs
pm2 logs deals247-backend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx
```

### Backup
```bash
# Database backup
mysqldump -h your-db-host -u your-user -p your-db > backup.sql

# Files backup
tar -czf files-backup.tar.gz /var/www/deals247
```

## Troubleshooting

### Common Issues

1. **Port 80/443 already in use:**
   ```bash
   sudo netstat -tulpn | grep :80
   sudo netstat -tulpn | grep :443
   ```

2. **Permission issues:**
   ```bash
   sudo chown -R www-data:www-data /var/www/deals247
   ```

3. **Database connection failed:**
   - Check credentials in `.env`
   - Verify database server is accessible
   - Check firewall settings

4. **SSL certificate issues:**
   ```bash
   sudo certbot certificates
   sudo certbot --nginx -d yourdomain.com
   ```

### Performance Tuning

1. **PM2 clustering:**
   ```bash
   pm2 start server/index.js -i max
   ```

2. **Nginx optimization:**
   - Enable gzip compression
   - Setup caching headers
   - Configure rate limiting

3. **Database optimization:**
   - Add indexes for frequently queried columns
   - Configure connection pooling
   - Enable query caching

## Security Checklist

- [ ] SSH key authentication enabled
- [ ] UFW firewall configured
- [ ] SSL/TLS certificates installed
- [ ] Database credentials secured
- [ ] File permissions set correctly
- [ ] Sensitive data encrypted
- [ ] Regular security updates enabled
- [ ] Fail2ban configured for SSH protection

## Support

If you encounter issues:
1. Check the logs using the commands above
2. Verify your environment configuration
3. Ensure all prerequisites are met
4. Check the GitHub repository for updates

## Production URLs

After successful deployment:
- **Website:** `https://yourdomain.com`
- **API:** `https://yourdomain.com/api`
- **Health Check:** `https://yourdomain.com/api/health`