import express from 'express';
import pkg from 'nodemailer';
const { createTransport } = pkg;

const router = express.Router();

// Create a transporter with automatic email provider detection
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER || 'D247Online@outlook.com';
  const emailPass = process.env.EMAIL_PASSWORD;
  
  // Auto-detect email provider
  let config;
  
  if (emailUser.includes('@gmail.com')) {
    // Gmail configuration
    config = {
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    };
  } else if (emailUser.includes('@outlook.com') || emailUser.includes('@hotmail.com')) {
    // Outlook/Hotmail configuration
    // Note: Outlook requires OAuth2 or App Password with modern auth enabled
    config = {
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass
      },
      tls: {
        rejectUnauthorized: false
      },
      requireTLS: true
    };
  } else {
    // Generic SMTP configuration
    config = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass
      },
      tls: {
        rejectUnauthorized: false
      }
    };
  }
  
  return createTransport(config);
};

// POST /api/contact - Send contact form email
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }

    // Create email HTML content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #9333ea 0%, #4f46e5 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; }
          .field { margin-bottom: 20px; }
          .label { font-weight: bold; color: #666; display: block; margin-bottom: 5px; }
          .value { background: white; padding: 10px; border-radius: 4px; border: 1px solid #e0e0e0; }
          .footer { background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">New Contact Form Submission - Deals247</h2>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">From:</span>
              <div class="value">${name}</div>
            </div>
            <div class="field">
              <span class="label">Email:</span>
              <div class="value"><a href="mailto:${email}">${email}</a></div>
            </div>
            <div class="field">
              <span class="label">Subject:</span>
              <div class="value">${subject}</div>
            </div>
            <div class="field">
              <span class="label">Message:</span>
              <div class="value" style="white-space: pre-wrap;">${message}</div>
            </div>
            <div class="field">
              <span class="label">Submitted:</span>
              <div class="value">${new Date().toLocaleString()}</div>
            </div>
          </div>
          <div class="footer">
            <p>This email was sent from the Deals247 contact form at deals247.online</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Configure email options
    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER || 'D247Online@outlook.com'}>`,
      to: 'D247Online@outlook.com',
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html: emailHtml,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}\n\nSubmitted: ${new Date().toLocaleString()}`
    };

    // Send email
    const transporter = createTransporter();
    await transporter.sendMail(mailOptions);

    console.log(`✅ Contact form email sent from ${email}`);

    res.json({
      success: true,
      message: 'Your message has been sent successfully! We\'ll get back to you within 24-48 hours.'
    });

  } catch (error) {
    console.error('❌ Error sending contact form email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again or email us directly at D247Online@outlook.com'
    });
  }
});

export default router;
