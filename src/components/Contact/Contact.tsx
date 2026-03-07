import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import emailjs from '@emailjs/browser';
import { 
  Mail, Phone, MapPin, Send, 
  Linkedin, Github, Instagram, FileText,
  MessageCircle, CheckCircle, AlertCircle, Calendar, User
} from 'lucide-react';
import { 
  EMAILJS_CONFIG, 
  WHATSAPP_CONFIG,
  CONTACT_EMAIL,
  sanitizeInput,
  isValidEmail,
  isValidPhone,
  formatWhatsAppMessage
} from '../../utils/emailjs';

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    value: WHATSAPP_CONFIG.PHONE_NUMBER,
    link: `tel:${WHATSAPP_CONFIG.PHONE_NUMBER.replace(/\D/g, '')}`
  },
  {
    icon: Mail,
    title: 'Email',
    value: CONTACT_EMAIL,
    link: `mailto:${CONTACT_EMAIL}`
  },
  {
    icon: MapPin,
    title: 'Location',
    value: 'Nerul, Navi Mumbai',
    link: '#'
  },
  {
    icon: Calendar,
    title: 'Availability',
    value: 'Open to Opportunities',
    link: '#'
  }
];

const socialLinks = [
  {
    icon: Linkedin,
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/susmitnaik/',
    color: 'from-blue-600 to-blue-700'
  },
  {
    icon: Github,
    name: 'GitHub',
    url: 'https://github.com/susmit2004',
    color: 'from-gray-700 to-gray-900'
  },
  {
    icon: Instagram,
    name: 'Instagram',
    url: 'https://www.instagram.com/susmit._.naik._.04/',
    color: 'from-pink-500 to-purple-600'
  },
  {
    icon: MessageCircle,
    name: 'WhatsApp',
    url: `https://wa.me/${WHATSAPP_CONFIG.PHONE_NUMBER.replace(/\D/g, '')}`,
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: FileText,
    name: 'Resume',
    url: '/Resume.pdf',
    color: 'from-orange-500 to-red-600'
  }
];

type FormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type FormErrors = {
  [key in keyof FormData]?: string;
};

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(sectionRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo(formRef.current,
      { x: -50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: formRef.current,
          start: 'top bottom-=50',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo(infoRef.current,
      { x: 50, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: infoRef.current,
          start: 'top bottom-=50',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Validate and sanitize name
    const sanitizedName = sanitizeInput(formData.name);
    if (!sanitizedName) {
      newErrors.name = 'Name is required';
    }
    
    // Validate and sanitize email
    const sanitizedEmail = sanitizeInput(formData.email);
    if (!sanitizedEmail) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(sanitizedEmail)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Validate phone (optional but if provided must be valid)
    const sanitizedPhone = sanitizeInput(formData.phone);
    if (sanitizedPhone && !isValidPhone(sanitizedPhone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    // Subject is optional - no validation needed
    
    // Validate and sanitize message
    const sanitizedMessage = sanitizeInput(formData.message);
    if (!sanitizedMessage) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Prepare WhatsApp URL (always opens)
    const whatsappUrl = `https://wa.me/${WHATSAPP_CONFIG.PHONE_NUMBER.replace(/\D/g, '')}?text=${formatWhatsAppMessage(
      sanitizeInput(formData.name),
      sanitizeInput(formData.email),
      sanitizeInput(formData.phone),
      sanitizeInput(formData.subject),
      sanitizeInput(formData.message)
    )}`;
    
    // Prepare mailto link as backup (always works)
    const mailtoLink = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(sanitizeInput(formData.subject) || 'Portfolio Contact')}&body=${encodeURIComponent(
      `Name: ${sanitizeInput(formData.name)}\nEmail: ${sanitizeInput(formData.email)}\nPhone: ${sanitizeInput(formData.phone) || 'Not provided'}\n\nMessage:\n${sanitizeInput(formData.message)}`
    )}`;
    
    try {
      // Try to send email via EmailJS
      const templateParams = {
        from_name: sanitizeInput(formData.name),
        from_email: sanitizeInput(formData.email),
        phone: sanitizeInput(formData.phone) || 'Not provided',
        subject: sanitizeInput(formData.subject) || 'Not provided',
        message: sanitizeInput(formData.message),
      };

      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );
    } catch (error) {
      console.log('EmailJS failed, using fallback: mailto link');
    }
    
    // Open WhatsApp with pre-filled message
    window.open(whatsappUrl, '_blank');
    
    // Also open email client as backup
    window.location.href = mailtoLink;

    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 3000);
    
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  return (
    <section ref={sectionRef} id="contact" className="py-20 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get In <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Interested in collaboration or opportunities? Let's connect!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div ref={formRef}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              
              <div className="relative bg-background-lighter/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 group-hover:border-primary/50 transition-all duration-500">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Message Sent Successfully!</h3>
                    <p className="text-gray-400 mb-6">
                      Thank you for your message. I'll get back to you soon.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="btn-secondary"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                          Name *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 bg-background/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 ${
                              errors.name ? 'border-red-500' : 'border-gray-700'
                            }`}
                            placeholder="Enter your name"
                          />
                          {errors.name && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <AlertCircle className="w-5 h-5 text-red-500" />
                            </div>
                          )}
                        </div>
                        {errors.name && (
                          <p className="text-red-500 text-sm">{errors.name}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                          Email *
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 bg-background/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 ${
                              errors.email ? 'border-red-500' : 'border-gray-700'
                            }`}
                            placeholder="Enter your email"
                          />
                          {errors.email && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <AlertCircle className="w-5 h-5 text-red-500" />
                            </div>
                          )}
                        </div>
                        {errors.email && (
                          <p className="text-red-500 text-sm">{errors.email}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                          Phone Number <span className="text-gray-500">(Optional)</span>
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 bg-background/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 ${
                              errors.phone ? 'border-red-500' : 'border-gray-700'
                            }`}
                            placeholder="Enter your phone number"
                          />
                          {errors.phone && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <AlertCircle className="w-5 h-5 text-red-500" />
                            </div>
                          )}
                        </div>
                        {errors.phone && (
                          <p className="text-red-500 text-sm">{errors.phone}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-300">
                          Subject <span className="text-gray-500">(Optional)</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 bg-background/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 ${
                              errors.subject ? 'border-red-500' : 'border-gray-700'
                            }`}
                            placeholder="What is this regarding?"
                          />
                          {errors.subject && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <AlertCircle className="w-5 h-5 text-red-500" />
                            </div>
                          )}
                        </div>
                        {errors.subject && (
                          <p className="text-red-500 text-sm">{errors.subject}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                          Message *
                        </label>
                        <div className="relative">
                          <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={5}
                            className={`w-full px-4 py-3 bg-background/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 resize-none ${
                              errors.message ? 'border-red-500' : 'border-gray-700'
                            }`}
                            placeholder="Your message here..."
                          />
                          {errors.message && (
                            <div className="absolute right-3 top-3">
                              <AlertCircle className="w-5 h-5 text-red-500" />
                            </div>
                          )}
                        </div>
                        {errors.message && (
                          <p className="text-red-500 text-sm">{errors.message}</p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div ref={infoRef}>
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  
                  return (
                    <a
                      key={index}
                      href={info.link}
                      className="group relative block"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="relative bg-background-lighter/30 backdrop-blur-sm rounded-xl p-6 border border-gray-800 group-hover:border-primary/50 transition-all duration-500">
                        <div className="flex items-center">
                          <div className="p-3 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 mr-4 group-hover:scale-110 transition-transform duration-300">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">{info.title}</div>
                            <div className="text-lg font-medium">{info.value}</div>
                          </div>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-2xl font-bold mb-6">Connect With Me</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    
                    return (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${social.color} rounded-xl opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                        
                        <div className="relative bg-background-lighter/30 backdrop-blur-sm rounded-xl p-5 border border-gray-800 group-hover:border-primary/50 transition-all duration-500">
                          <div className="flex flex-col items-center text-center">
                            <div className={`p-3 rounded-lg bg-gradient-to-br ${social.color} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-medium text-sm">{social.name}</span>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Quick Response */}
              <div className="bg-gradient-to-br from-background-lighter to-background rounded-2xl border border-gray-800 p-6">
                <div className="flex items-center mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 mr-3">
                    <User className="w-5 h-5 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold">Quick Response</h3>
                </div>
                <p className="text-gray-400 mb-4">
                  I typically respond within 24 hours. For internship inquiries or collaboration proposals, 
                  please include relevant details in your message.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    <span className="text-sm text-gray-300">MCA Internship Opportunities</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-secondary rounded-full mr-3" />
                    <span className="text-sm text-gray-300">AI/ML Project Collaboration</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3" />
                    <span className="text-sm text-gray-300">Freelance Development Work</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}