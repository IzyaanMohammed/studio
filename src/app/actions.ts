
'use server';

import { z } from 'zod';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long.'),
  email: z.string().email('Please enter a valid email address.'),
  message: z.string().min(10, 'Message must be at least 10 characters long.'),
});

export type FormState = {
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
  success: boolean;
};

export async function submitContactForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set. Email will not be sent.');
    return {
      message: 'The server is not configured to send emails. Please contact the administrator.',
      success: false,
    };
  }

  const validatedFields = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Please correct the errors below.',
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  const { name, email, message } = validatedFields.data;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Pixel8 Contact Form <onboarding@resend.dev>', // This must be a verified domain on Resend
      to: ['izyaankaka11@gmail.com'],
      subject: `New message from ${name} via Pixel8 Studios site`,
      reply_to: email,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      console.error('Resend API Error:', error);
      return {
        message: 'An error occurred while sending the email. Please try again later.',
        success: false,
      };
    }

    return {
      message: 'Thank you for your message! We will get back to you soon.',
      success: true,
    };
  } catch (e) {
    console.error('Submit Contact Form Error:', e);
    return {
      message: 'An unexpected error occurred. Please try again.',
      success: false,
    };
  }
}
