import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Email service is not configured.' },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);
    const { name, email, phone, message } = await req.json();

    // Basic validation
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    const toEmail = process.env.CONTACT_TO_EMAIL || 'subu22725@gmail.com';
    const { data, error } = await resend.emails.send({
      from: 'Dang E Drive <onboarding@resend.dev>',
      to: [toEmail],
      replyTo: email,
      subject: `New Booking Request from ${name}`,
      html: `
        <h2>New Booking Request — Dang E Drive</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json(
      { error: 'Something went wrong sending the email.' },
      { status: 500 }
    );
  }
}
