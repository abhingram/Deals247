# Email Configuration Guide for Contact Form

## Issue: Outlook Basic Authentication Disabled

Microsoft Outlook/Hotmail has disabled basic authentication (username/password) for SMTP. You have two options:

## Option 1: Use Gmail (Recommended - Easier Setup)

### Step 1: Create/Use Gmail Account
- If you don't have one, create a Gmail account at https://gmail.com
- Or use an existing Gmail account

### Step 2: Enable 2-Step Verification
1. Go to: https://myaccount.google.com/security
2. Click "2-Step Verification" 
3. Follow the steps to enable it

### Step 3: Create App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select "Mail" and "Other (Custom name)"
3. Name it "Deals247 Contact Form"
4. Click "Generate"
5. Copy the 16-character password (e.g., "abcd efgh ijkl mnop")

### Step 4: Update .env Files
Edit both `server/.env` and `server/.env.production`:

```env
# Replace with your Gmail address
EMAIL_USER=your-gmail@gmail.com
# Use the app password from step 3 (remove spaces)
EMAIL_PASSWORD=abcdefghijklmnop
```

### Step 5: Update Contact Route
The contact route will automatically use Gmail SMTP when you use a Gmail address.

---

## Option 2: Use Outlook with OAuth2 (More Complex)

This requires setting up Azure AD application and OAuth2 tokens. If you want to stick with Outlook, you need to:

1. Register an app in Azure AD
2. Configure Microsoft Graph API permissions
3. Implement OAuth2 refresh token flow
4. Update the nodemailer configuration

This is significantly more complex and requires additional setup.

---

## Option 3: Use Alternative Email Service

### SendGrid (Free tier: 100 emails/day)
1. Sign up at https://sendgrid.com
2. Create an API key
3. Update the transporter to use SendGrid

### Mailgun (Free tier: 5,000 emails/month)
1. Sign up at https://www.mailgun.com
2. Get your API credentials
3. Update the transporter to use Mailgun

---

## Recommendation

**Use Option 1 (Gmail)** - it's the simplest and most reliable for small to medium volume contact forms. Gmail's SMTP is well-supported and the app password method is straightforward.

Once configured:
1. All contact form submissions will come FROM your Gmail
2. They will be sent TO D247Online@outlook.com
3. Reply-To will be set to the person who submitted the form
4. You can reply directly from D247Online@outlook.com

---

## After Configuring

1. **Update .env files** with your email credentials
2. **Restart the backend**: 
   ```powershell
   # Stop current server
   Stop-Process -Name node -Force
   # Start new one
   cd server
   node index.js
   ```
3. **Test the form** at http://localhost:3000/contact
