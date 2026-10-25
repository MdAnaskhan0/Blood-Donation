import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

let transporter = null;

if (env.smtp.host) {
  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.port === 465,
    auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
  });
}

export async function sendMail({ to, subject, html }) {
  if (!transporter) {
    // Dev fallback: print to console so you can click the link without SMTP.
    console.log('\n--- EMAIL (SMTP not configured) ---');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    console.log('-----------------------------------\n');
    return;
  }
  await transporter.sendMail({ from: env.smtp.from, to, subject, html });
}
