import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Database, 
  Brain, 
  Code, 
  Target, 
  Calendar,
  Users,
  Award,
  Cpu,
  BarChart3
} from 'lucide-react';

const About = () => {
  const technologies = [
    { name: 'Python', icon: Code, description: 'Core development language' },
    { name: 'TensorFlow', icon: Brain, description: 'Deep learning framework' },
    { name: 'Natural Language Processing', icon: BarChart3, description: 'Text analysis and processing' },
    { name: 'Machine Learning', icon: Cpu, description: 'Predictive modeling' },
  ];

  const timeline = [
    { phase: 'Research & Planning', progress: 100, status: 'Complete' },
    { phase: 'Data Collection', progress: 100, status: 'Complete' },
    { phase: 'Model Development', progress: 85, status: 'In Progress' },
    { phase: 'Clinical Testing', progress: 60, status: 'In Progress' },
    { phase: 'Validation & Deployment', progress: 30, status: 'Planned' },
  ];

  const achievements = [
    { metric: '10,000+', label: 'Text samples analyzed' },
    { metric: '85%', label: 'Accuracy achieved' },
    { metric: '500ms', label: 'Average analysis time' },
    { metric: '3', label: 'Clinical partners' },
  ];

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="hero-gradient py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            About Our Research
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A pioneering healthcare AI project focused on early detection of Alzheimer's 
            disease through advanced natural language processing and machine learning.
          </p>
        </div>
      </section>

      {/* Project Overview */}
      <section className="py-16 bg-surface-elevated">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                Research Team & Vision
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  This project represents a collaborative effort between computer science 
                  researchers, neuroscientists, and clinical professionals to address one 
                  of the most pressing healthcare challenges of our time.
                </p>
                <p>
                  Our interdisciplinary team combines expertise in artificial intelligence, 
                  computational linguistics, and neurodegenerative diseases to develop 
                  innovative diagnostic tools.
                </p>
                <p>
                  As a student research project, this work demonstrates the potential of 
                  AI in healthcare while adhering to the highest standards of medical 
                  research ethics and scientific rigor.
                </p>
              </div>
            </div>
            <div className="medical-card p-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Student Research Project</h3>
                    <p className="text-sm text-muted-foreground">Graduate-level healthcare AI research</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Interdisciplinary Team</h3>
                    <p className="text-sm text-muted-foreground">AI researchers & medical professionals</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <Award className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Clinical Focus</h3>
                    <p className="text-sm text-muted-foreground">Real-world healthcare applications</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-16 clinical-gradient">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Technology & Methods
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our solution leverages cutting-edge AI technologies and established 
              medical research methodologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technologies.map((tech, index) => (
              <Card key={index} className="medical-card text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <tech.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2 text-foreground">{tech.name}</h3>
                  <p className="text-sm text-muted-foreground">{tech.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dataset Information */}
      <section className="py-16 bg-surface-elevated">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="medical-card p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Database className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">OASIS Dataset</h3>
                  <p className="text-sm text-muted-foreground">Open Access Series of Imaging Studies</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Participants:</span>
                  <span className="font-medium">1,000+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Language Samples:</span>
                  <span className="font-medium">5,000+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Data Source:</span>
                  <span className="font-medium">Kaggle & Clinical Partners</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Ethics Review:</span>
                  <Badge variant="outline" className="text-success border-success">Approved</Badge>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                Dataset & Training
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Our model is trained on the prestigious OASIS (Open Access Series of 
                  Imaging Studies) dataset, which provides longitudinal neuroimaging and 
                  clinical data from research participants.
                </p>
                <p>
                  The dataset includes speech and language samples from both healthy 
                  individuals and those with various stages of cognitive decline, 
                  enabling robust model training and validation.
                </p>
                <p>
                  All data usage follows strict ethical guidelines and privacy protocols, 
                  with full institutional review board approval and participant consent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Timeline */}
      <section className="py-16 clinical-gradient">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Project Timeline & Progress
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track our research milestones and development progress toward clinical deployment.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Timeline */}
              <Card className="medical-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>Development Timeline</span>
                  </CardTitle>
                  <CardDescription>
                    Progress across major project phases
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {timeline.map((phase, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">{phase.phase}</span>
                        <Badge 
                          variant={phase.status === 'Complete' ? 'default' : 'outline'}
                          className={
                            phase.status === 'Complete' 
                              ? 'bg-success text-success-foreground' 
                              : phase.status === 'In Progress'
                              ? 'border-primary text-primary'
                              : 'border-muted-foreground text-muted-foreground'
                          }
                        >
                          {phase.status}
                        </Badge>
                      </div>
                      <Progress value={phase.progress} className="h-2" />
                      <div className="text-xs text-muted-foreground text-right">
                        {phase.progress}% Complete
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="medical-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span>Key Achievements</span>
                  </CardTitle>
                  <CardDescription>
                    Research milestones and metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    {achievements.map((achievement, index) => (
                      <div key={index} className="text-center">
                        <div className="text-2xl font-bold text-primary mb-1">
                          {achievement.metric}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {achievement.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Goals & Objectives */}
      <section className="py-16 bg-surface-elevated">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Goals & Objectives
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our mission to advance early detection and improve patient outcomes through AI innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Primary Goal */}
            <Card className="medical-card">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Primary Objective</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Develop a clinically viable AI system capable of detecting early signs 
                  of Alzheimer's disease from speech patterns with 90%+ accuracy.
                </p>
              </CardContent>
            </Card>

            {/* Secondary Goal */}
            <Card className="medical-card">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Clinical Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Enable earlier intervention strategies by identifying at-risk individuals 
                  3-5 years before traditional diagnostic methods.
                </p>
              </CardContent>
            </Card>

            {/* Future Goal */}
            <Card className="medical-card">
              <CardHeader>
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-success" />
                </div>
                <CardTitle>Future Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Scale the technology for widespread clinical adoption, making early 
                  Alzheimer's screening accessible to primary care providers globally.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;