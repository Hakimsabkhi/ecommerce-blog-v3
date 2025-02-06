import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const sendEmail = async (
  userEmail: string,
  subject: string,
  message: string
) => {
  try {
     const transporter = nodemailer.createTransport({
          service: 'gmail', // or another email service provider
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
  

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject,
      html: message,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong" + error,
      },
      {
        status: 500,
      }
    );
  }
};