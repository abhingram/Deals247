# Email Configuration Setup for Contact Form

## Overview
The contact form is now configured to send emails to **D247Online@outlook.com** using Outlook SMTP.

## Required: Create an App Password

Since you're using a Microsoft/Outlook account with 2FA (two-factor authentication), you need to create an **App Password** instead of using your regular password.

### Steps to Create an App Password:

1. **Go to Microsoft Account Security**
   - Visit: https://account.microsoft.com/security
   - Sign in with D247Online@outlook.com

2. **Navigate to Advanced Security Options**
   - Click on "Security" tab
   - Find and click "Advanced security options"

3. **Create App Password**
   - Scroll down to "App passwords"
   - Click "Create a new app password"
   - A password will be generated (e.g., "abcd-efgh-ijkl-mnop")
   - **Copy this password immediately** (you won't be able to see it again)

4. **Update Environment Variables**
   
   **For Local Development:**
   - Open: `server/.env`
   - Replace `your-outlook-app-password-here` with the generated app password
   ```
   EMAIL_PASSWORD=abcd-efgh-ijkl-mnop
   ```

   **For Production (VPS):**
   - Open: `server/.env.production`
   - Replace `your-outlook-app-password-here` with the same app password
   ```
   EMAIL_PASSWORD=abcd-efgh-ijkl-mnop
   ```

5. **Restart the Backend Server**
   
   **Local:**
   ```bash
   npm run server:dev
   ```
   
   **Production (on VPS):**
   ```bash
   ssh root@72.61.235.42
   cd /root/deals247
   pm2 restart backend
   ```

## Testing the Contact Form

1. **Start Backend Server** (if not running):
   ```bash
   npm run server:dev
   ```

2. **Visit Contact Page**:
   - Local: http://localhost:3000/contact
   - Production: https://deals247.online/contact

3. **Fill Out Form**:
   - Name: Your Name
   - Email: test@example.com
   - Subject: Select a category
   - Message: Test message

4. **Submit & Check**:
   - You should see a success message
   - Check D247Online@outlook.com inbox for the email

## Configuration Details

### SMTP Settings:
- **Host**: smtp-mail.outlook.com
- **Port**: 587 (STARTTLS)
- **Encryption**: STARTTLS
- **From**: D247Online@outlook.com
- **To**: D247Online@outlook.com

### Email Format:
The contact form sends beautifully formatted HTML emails with:
- Sender name and email
- Subject category
- Message content
- Submission timestamp
- Reply-to header (automatically set to sender's email)

## Troubleshooting

### "Authentication failed"
- Make sure you're using the **App Password**, not your regular Outlook password
- Verify the app password is correct in both .env files
- Ensure there are no spaces or quotes around the password

### "Connection timeout"
- Check your internet connection
- Verify port 587 is not blocked by firewall
- On VPS, ensure firewall allows outbound connections on port 587

### Emails not arriving
- Check spam/junk folder in D247Online@outlook.com
- Verify the email address in the .env files is correct
- Check server console for error messages

### Production Deployment
When deploying to production, make sure to:
1. Update `server/.env.production` with the app password
2. Upload the updated .env.production to VPS
3. Restart the backend with `pm2 restart backend`
4. Update ContactUs.jsx API URL from localhost to production URL

## API Endpoint

**POST** `/api/contact`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "General Inquiry",
  "message": "Hello, I have a question..."
}
```

**Success Response**:
```json
{
  "success": true,
  "message": "Your message has been sent successfully! We'll get back to you within 24-48 hours."
}
```

**Error Response**:
```json
{
  "success": false,
  "message": "Failed to send message. Please try again or email us directly at D247Online@outlook.com"
}
```

## Files Modified

1. **server/routes/contact.js** - New contact form API endpoint
2. **server/index.js** - Added contact route
3. **src/pages/ContactUs.jsx** - Updated to call real API
4. **server/.env** - Added email configuration
5. **server/.env.production** - Added production email configuration
6. **package.json** - Added nodemailer dependency

## Next Steps

1. ✅ Create App Password for D247Online@outlook.com
2. ✅ Update both .env files with the app password
3. ✅ Test locally with `npm run server:dev`
4. ✅ Deploy to production and update production .env
5. ✅ Test on live site at deals247.online/contact
