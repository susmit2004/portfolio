// EmailJS Configuration
// Get these from your EmailJS Dashboard: https://www.emailjs.com/

export const EMAILJS_CONFIG = {
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
};

// WhatsApp Configuration
export const WHATSAPP_CONFIG = {
  PHONE_NUMBER: import.meta.env.VITE_WHATSAPP_PHONE_NUMBER || '+919307366418',
  DEFAULT_MESSAGE: 'Hello! I found your portfolio and would like to connect.',
};

// Contact email for fallback
export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'susmitnaik14@gmail.com';

// Sanitize input to prevent XSS and injection attacks
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (Indian format)
export const isValidPhone = (phone: string): boolean => {
  if (!phone.trim()) return true; // Phone is optional
  const phoneRegex = /^[+]?[\d\s()-]{10,15}$/;
  return phoneRegex.test(phone);
};

// Format WhatsApp message
export const formatWhatsAppMessage = (
  name: string,
  email: string,
  phone: string,
  subject: string,
  message: string
): string => {
  const formattedMessage = `
*New Contact Form Submission*

*Name:* ${name}
*Email:* ${email}
*Phone:* ${phone || 'Not provided'}
*Subject:* ${subject || 'Not provided'}

*Message:*
${message}
  `.trim();

  return encodeURIComponent(formattedMessage);
};

