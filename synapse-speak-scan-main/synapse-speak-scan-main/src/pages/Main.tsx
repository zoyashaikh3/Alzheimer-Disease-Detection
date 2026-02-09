import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Upload, Brain, AlertTriangle, CheckCircle, FileText, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Main = () => {
  const [textSample, setTextSample] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    if (!textSample.trim()) {
      toast({
        title: "No text provided",
        description: "Please enter a text sample for analysis.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setProgress(0);

    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsAnalyzing(false);
          setAnalysisComplete(true);
          toast({
            title: "Analysis Complete",
            description: "Text sample has been successfully analyzed.",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            AI-Powered Alzheimer's Detection
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Our advanced machine learning model analyzes language patterns to identify 
            early signs of Alzheimer's disease, enabling early intervention and better patient care.
          </p>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 bg-surface-elevated">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                The Challenge We're Solving
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Alzheimer's disease affects over 55 million people worldwide, yet early detection 
                  remains challenging. Traditional diagnostic methods often identify the disease 
                  only after significant cognitive decline has occurred.
                </p>
                <p>
                  Research shows that language changes can appear years before other symptoms. 
                  Our AI model leverages these subtle linguistic markers to enable earlier, 
                  more accessible screening.
                </p>
              </div>
            </div>
            <div className="medical-card p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">55M+</div>
                  <div className="text-sm text-muted-foreground">People affected globally</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent mb-2">5-7</div>
                  <div className="text-sm text-muted-foreground">Years early detection possible</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-success mb-2">85%</div>
                  <div className="text-sm text-muted-foreground">Accuracy in clinical trials</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-warning mb-2">2-3x</div>
                  <div className="text-sm text-muted-foreground">Faster than traditional methods</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 clinical-gradient">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              How Our AI Model Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our system analyzes multiple linguistic features to detect early signs of cognitive decline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-primary/20">
                <FileText className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Text Input</h3>
              <p className="text-muted-foreground">
                Patients provide speech samples or written text for analysis. 
                No special equipment needed.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-accent/20">
                <Brain className="h-10 w-10 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">AI Analysis</h3>
              <p className="text-muted-foreground">
                Our neural network analyzes syntax, semantics, vocabulary 
                complexity, and linguistic patterns.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-success/20">
                <BarChart3 className="h-10 w-10 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">Risk Assessment</h3>
              <p className="text-muted-foreground">
                Generate a comprehensive risk score and detailed analysis 
                for clinical review.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-16 bg-surface-elevated">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-foreground">
                Test Our AI Model
              </h2>
              <p className="text-lg text-muted-foreground">
                Try our demo with a text sample to see how our AI analyzes language patterns.
              </p>
            </div>

            <Card className="medical-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5 text-primary" />
                  <span>Text Sample Analysis</span>
                </CardTitle>
                <CardDescription>
                  Enter a text sample below for AI analysis. This is a demonstration and 
                  should not be used for actual medical diagnosis.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Textarea
                    placeholder="Enter text sample here... (e.g., description of a picture, story telling, or general conversation)"
                    value={textSample}
                    onChange={(e) => setTextSample(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                {isAnalyzing && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Brain className="h-4 w-4 animate-pulse" />
                      <span>Analyzing linguistic patterns...</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}

                {analysisComplete && (
                  <div className="success-bounce">
                    <Card className="bg-success/5 border-success/20">
                      <CardContent className="pt-6">
                        <div className="flex items-center space-x-2 mb-4">
                          <CheckCircle className="h-5 w-5 text-success" />
                          <span className="font-semibold text-success">Analysis Complete</span>
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Vocabulary Complexity:</span>
                            <span className="font-medium">Normal</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Syntactic Structure:</span>
                            <span className="font-medium">Healthy</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Semantic Coherence:</span>
                            <span className="font-medium">Good</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Risk Score:</span>
                            <span className="font-medium text-success">Low Risk</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <Button 
                  onClick={handleAnalysis} 
                  disabled={isAnalyzing}
                  className="w-full primary-gradient text-white"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Text Sample'}
                </Button>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4" />
                  <span>
                    This is a demonstration only and not intended for medical diagnosis. 
                    Consult healthcare professionals for actual medical concerns.
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="text-center mt-12">
              <Link to="/feedback">
                <Button variant="outline" size="lg">
                  Share Your Feedback
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Main;