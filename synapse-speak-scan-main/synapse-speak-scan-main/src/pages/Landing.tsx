import { Button } from '@/components/ui/button';
import { ArrowDown, Brain, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBrain from '@/assets/hero-brain.jpg';

const Landing = () => {
  const scrollToMain = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${heroBrain})` }}
        />
        
        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="mb-8 fade-in">
            <div className="inline-flex items-center space-x-2 bg-surface-elevated/80 backdrop-blur-sm rounded-full px-4 py-2 border border-border mb-6">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Healthcare AI Research</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 fade-in-delay">
            <span className="typewriter font-medical">
              Early Detection of Alzheimer's
            </span>
            <br />
            <span className="text-primary">from Language Patterns</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 fade-in-delay font-light">
            Harnessing AI to detect Alzheimer's early from how we speak.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center fade-in-delay">
            <Button 
              size="lg" 
              className="primary-gradient text-white border-0 hover:scale-105 transition-transform"
              onClick={scrollToMain}
            >
              Get Started
              <ArrowDown className="ml-2 h-4 w-4" />
            </Button>
            
            <Link to="/main">
              <Button variant="outline" size="lg" className="hover:bg-primary/5">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="h-6 w-6 text-muted-foreground" />
        </div>
      </section>

      {/* Features Preview Section */}
      <section className="py-20 clinical-gradient">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Advanced AI for Early Detection
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our cutting-edge technology analyzes speech patterns to identify 
              early signs of cognitive decline with unprecedented accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="medical-card p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">AI-Powered Analysis</h3>
              <p className="text-muted-foreground">
                Advanced neural networks trained on extensive linguistic datasets 
                to detect subtle changes in language patterns.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="medical-card p-8 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Rapid Detection</h3>
              <p className="text-muted-foreground">
                Quick analysis of speech samples enables early intervention 
                and better patient outcomes through timely diagnosis.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="medical-card p-8 text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Clinical Grade</h3>
              <p className="text-muted-foreground">
                Built with healthcare standards in mind, ensuring reliability 
                and accuracy for clinical decision-making.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link to="/main">
              <Button size="lg" variant="outline" className="hover:bg-primary/5">
                Explore the Technology
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;