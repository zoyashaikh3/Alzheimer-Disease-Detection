import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Heart, Star, Send, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    rating: '',
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
        title: "Feedback submitted!",
        description: "Thank you for your valuable insights.",
      });
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center clinical-gradient">
        <div className="container mx-auto px-6">
          <Card className="max-w-2xl mx-auto medical-card text-center success-bounce">
            <CardContent className="pt-12 pb-12">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>
              <h1 className="text-3xl font-bold mb-4 text-foreground">
                Thank You!
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Your feedback has been successfully submitted. We appreciate your time 
                and insights in helping us improve our AI research.
              </p>
              <div className="flex items-center justify-center space-x-2 text-accent">
                <Heart className="h-5 w-5 fill-current" />
                <span className="font-medium">Your input helps advance healthcare AI</span>
              </div>
              <div className="mt-8">
                <Button 
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      category: '',
                      rating: '',
                      message: ''
                    });
                  }}
                  variant="outline"
                >
                  Submit Another Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 rounded-full bg-primary/10">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            We Value Your Insights!
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your feedback is crucial to improving our AI model and ensuring it meets 
            real-world healthcare needs. Share your thoughts and help shape the future 
            of Alzheimer's detection technology.
          </p>
        </div>
      </section>

      {/* Feedback Form */}
      <section className="py-16 clinical-gradient">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <Card className="medical-card">
                  <CardHeader>
                    <CardTitle className="text-2xl">Share Your Feedback</CardTitle>
                    <CardDescription>
                      Help us improve our AI model with your valuable insights and suggestions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Personal Information */}
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

                      {/* Feedback Category */}
                      <div className="space-y-2">
                        <Label htmlFor="category">Feedback Category</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usability">User Experience</SelectItem>
                            <SelectItem value="accuracy">Model Accuracy</SelectItem>
                            <SelectItem value="features">Feature Requests</SelectItem>
                            <SelectItem value="technical">Technical Issues</SelectItem>
                            <SelectItem value="clinical">Clinical Relevance</SelectItem>
                            <SelectItem value="general">General Feedback</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Rating */}
                      <div className="space-y-2">
                        <Label htmlFor="rating">Overall Rating</Label>
                        <Select value={formData.rating} onValueChange={(value) => handleInputChange('rating', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Rate your experience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                            <SelectItem value="4">⭐⭐⭐⭐ Very Good</SelectItem>
                            <SelectItem value="3">⭐⭐⭐ Good</SelectItem>
                            <SelectItem value="2">⭐⭐ Fair</SelectItem>
                            <SelectItem value="1">⭐ Needs Improvement</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Message */}
                      <div className="space-y-2">
                        <Label htmlFor="message">Your Feedback *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          placeholder="Please share your thoughts, suggestions, or any issues you encountered..."
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
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Submit Feedback
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Why Feedback Matters */}
                <Card className="medical-card">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-primary" />
                      <span>Why Your Feedback Matters</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      <strong className="text-foreground">Improve Accuracy:</strong> Help us fine-tune 
                      our AI model for better diagnostic precision.
                    </p>
                    <p>
                      <strong className="text-foreground">User Experience:</strong> Guide interface 
                      improvements for healthcare professionals.
                    </p>
                    <p>
                      <strong className="text-foreground">Clinical Relevance:</strong> Ensure our 
                      solution meets real-world medical needs.
                    </p>
                    <p>
                      <strong className="text-foreground">Future Development:</strong> Influence 
                      the roadmap for upcoming features and capabilities.
                    </p>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="medical-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Need to Discuss Further?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p className="text-muted-foreground">
                      For detailed discussions or collaboration opportunities:
                    </p>
                    <div className="space-y-2">
                      <p className="text-foreground">
                        <strong>Research Team:</strong><br />
                        <span className="text-muted-foreground">research@alzdetect.ai</span>
                      </p>
                      <p className="text-foreground">
                        <strong>Clinical Partnerships:</strong><br />
                        <span className="text-muted-foreground">clinical@alzdetect.ai</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Statistics */}
                <Card className="medical-card">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Star className="h-5 w-5 text-accent" />
                      <span>Community Impact</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Feedback Received:</span>
                      <span className="font-medium">250+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Features Implemented:</span>
                      <span className="font-medium">45</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Average Rating:</span>
                      <span className="font-medium">4.2/5 ⭐</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Feedback;