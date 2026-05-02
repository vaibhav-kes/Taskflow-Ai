const nodemailer = require('nodemailer');

/**
 * Create reusable transporter using SMTP configuration
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - Email body in HTML
 */
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"TaskFlow AI" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    // Don't throw — email failures shouldn't break the main flow
    return null;
  }
};

/**
 * Send welcome email to newly registered user
 * @param {string} email - User email
 * @param {string} name - User name
 */
const sendWelcomeEmail = async (email, name) => {
  const subject = 'Welcome to TaskFlow AI! 🚀';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4F46E5;">Welcome to TaskFlow AI!</h1>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Thank you for joining TaskFlow AI. We're excited to help you manage your projects and tasks more efficiently.</p>
      <p>Here's what you can do:</p>
      <ul>
        <li>📋 Create and manage projects</li>
        <li>✅ Assign and track tasks</li>
        <li>👥 Collaborate with your team</li>
        <li>📊 Monitor progress with dashboards</li>
      </ul>
      <p>Get started by logging in to your account!</p>
      <p>Best regards,<br>The TaskFlow AI Team</p>
    </div>
  `;
  return sendEmail(email, subject, html);
};

/**
 * Send task assignment notification email
 * @param {string} email - Assignee email
 * @param {string} name - Assignee name
 * @param {object} task - Task details
 */
const sendTaskAssignmentEmail = async (email, name, task) => {
  const subject = `New Task Assigned: ${task.title}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #4F46E5;">New Task Assigned</h1>
      <p>Hi <strong>${name}</strong>,</p>
      <p>You have been assigned a new task:</p>
      <div style="background: #F3F4F6; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <h3 style="margin: 0 0 8px 0;">${task.title}</h3>
        <p style="margin: 0 0 4px 0;"><strong>Priority:</strong> ${task.priority}</p>
        <p style="margin: 0 0 4px 0;"><strong>Status:</strong> ${task.status}</p>
        ${task.dueDate ? `<p style="margin: 0;"><strong>Due Date:</strong> ${new Date(task.dueDate).toLocaleDateString()}</p>` : ''}
      </div>
      <p>Log in to TaskFlow AI to view the full details.</p>
      <p>Best regards,<br>The TaskFlow AI Team</p>
    </div>
  `;
  return sendEmail(email, subject, html);
};

module.exports = { sendEmail, sendWelcomeEmail, sendTaskAssignmentEmail };
