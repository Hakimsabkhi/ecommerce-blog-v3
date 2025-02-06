import { contactFormTemplate } from '@/lib/sendconctusts';
import { NextRequest, NextResponse } from 'next/server';

import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json().catch(() => null); // Fallback to null if parsing fails

    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON data' }, { status: 400 });
    }

    const { name, email, message } = body;

    // Validate the required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Create the transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email to contact
    const mailOptions1 = {
      from: process.env.EMAIL_FROM,
      to: process.env.Email_Contact,
      subject: `${name} contacted you`,
      html: contactFormTemplate(name, email, message),
    };

    // Confirmation email
    const mailOptions2 = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Contact request successfully received',
      html: 'Hello, thank you for reaching out. We will get back to you soon.',
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(mailOptions1),
      transporter.sendMail(mailOptions2),
    ]);

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      {
        message: 'Error sending email',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
