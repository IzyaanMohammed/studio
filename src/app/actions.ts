
'use server';

import { z } from 'zod';

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
  
  try {
    // Here you would typically send an email, save to a database, etc.
    // For this example, we'll simulate a network delay and log the data.
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('New contact form submission:', validatedFields.data);

    return {
      message: 'Thank you for your message! We will get back to you soon.',
      success: true,
    };
  } catch (e) {
    return {
      message: 'An unexpected error occurred. Please try again.',
      success: false,
    };
  }
}
