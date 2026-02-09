import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Twitter, 
  Linkedin,
  Send,
  ArrowUp,
  CheckCircle,
  Clock,
  Globe
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: "Message sent!",
        description: "We'll get back to you within 24 hours.",
      });
    }, 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      subtitle: 'Send us a message',
      value: 'research@alzdetect.ai',
      link: 'mailto:research@alzdetect.ai',
      color: 'primary'
    },
    {
      icon: Phone,
      title: 'Research Line',
      subtitle: 'Mon-Fri 9AM-5PM EST',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
      color: 'accent'
    },
    {
      icon: MapPin,
      title: 'Research Center',
      subtitle: 'University Campus',
      value: 'Boston, MA 02115',
      link: '#',
      color: 'success'
    }
  ];

  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      url: 'https://github.com/alzdetect-ai',
      color: 'text-foreground'
    },
    {
      icon: Twitter,
      label: 'Twitter',
      url: 'https://twitter.com/alzdetect_ai',
      color: 'text-blue-500'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      url: 'https://linkedin.com/company/alzdetect-ai',
      color: 'text-blue-600'
    },
    {
      icon: Globe,
      label: 'Research Portal',
      url: 'https://research.alzdetect.ai',
      color: 'text-primary'
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about our research? Interested in collaboration? 
            We'd love to hear from you and discuss how our AI technology can 
            advance healthcare together.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-surface-elevated">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <Card key={index} className="medical-card text-center hover:scale-105 transition-transform">
                <CardContent className="pt-8">
                  <div className={`w-16 h-16 bg-${method.color}/10 rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <method.icon className={`h-8 w-8 text-${method.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{method.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{method.subtitle}</p>
                  <a 
                    href={method.link}
                    className="text-primary hover:text-primary-dark font-medium transition-colors"
                  >
                    {method.value}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 clinical-gradient">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <Card className="medical-card">
                  <CardHeader>
                    <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isSubmitted ? (
                      <div className="text-center py-8 success-bounce">
                        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="h-8 w-8 text-success" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-foreground">Message Sent!</h3>
                        <p className="text-muted-foreground mb-6">
                          Thank you for reaching out. We'll respond within 24 hours.
                        </p>
                        <Button 
                          onClick={() => {
                            setIsSubmitted(false);
                            setFormData({ name: '', email: '', subject: '', message: '' });
                          }}
                          variant="outline"
                        >
                          Send Another Message
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name & Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              placeholder="Your full name"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              placeholder="your.email@example.com"
                              required
                            />
                          </div>
                        </div>

                        {/* Subject */}
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            value={formData.subject}
                            onChange={(e) => handleInputChange('subject', e.target.value)}
                            placeholder="What is this regarding?"
                          />
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                          <Label htmlFor="message">Message *</Label>
                          <Textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            placeholder="Tell us about your inquiry, collaboration ideas, or questions..."
                            className="min-h-[120px]"
                            required
                          />
                        </div>

                        {/* Submit Button */}
                        <Button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="w-full primary-gradient text-white"
                          size="lg"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                {/* Research Team */}
                <Card className="medical-card">
                  <CardHeader>
                    <CardTitle>Research Team</CardTitle>
                    <CardDescription>
                      Connect with our interdisciplinary research team
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Response Time</p>
                        <p className="text-sm text-muted-foreground">Usually within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-accent/10">
                        <Mail className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Office Hours</p>
                        <p className="text-sm text-muted-foreground">Monday - Friday, 9:00 AM - 5:00 PM EST</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Social Links */}
                <Card className="medical-card">
                  <CardHeader>
                    <CardTitle>Follow Our Research</CardTitle>
                    <CardDescription>
                      Stay updated with our latest developments and publications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {socialLinks.map((social, index) => (
                        <a
                          key={index}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 p-3 rounded-lg bg-surface hover:bg-surface/80 transition-colors group"
                        >
                          <social.icon className={`h-5 w-5 ${social.color} group-hover:scale-110 transition-transform`} />
                          <span className="text-sm font-medium text-foreground">{social.label}</span>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Collaboration */}
                <Card className="medical-card">
                  <CardHeader>
                    <CardTitle>Collaboration Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Clinical Partnerships:</strong> 
                      Partner with us for clinical trials and validation studies.
                    </p>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Research Collaboration:</strong> 
                      Joint research opportunities with academic institutions.
                    </p>
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Technology Integration:</strong> 
                      Explore how our AI can enhance your healthcare solutions.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      <Button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 rounded-full w-12 h-12 p-0 primary-gradient text-white shadow-lg hover:scale-110 transition-transform"
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default Contact;