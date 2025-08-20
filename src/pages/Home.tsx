import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Shield, Database, Target, ArrowRight, CheckCircle } from 'lucide-react';
import heroImage from '../assets/hero-image.jpg';
import { RootState } from '../store';

const Home = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  
  const features = [
    {
      icon: Shield,
      title: 'Privacy Engine',
      description: 'Advanced encryption and anonymization ensures complete data privacy while preserving valuable insights.'
    },
    {
      icon: Database,
      title: 'Data Sanitization',
      description: 'Automatically removes personally identifiable information while maintaining data utility for marketing analysis.'
    },
    {
      icon: Target,
      title: 'Smart Segmentation',
      description: 'AI-powered audience segmentation provides actionable insights without compromising individual privacy.'
    }
  ];

  const benefits = [
    'GDPR & CCPA Compliant',
    'Real-time Processing',
    '99.9% Uptime SLA',
    '24/7 Expert Support'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-95" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Privacy-Preserving AI for
              <span className="block bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
                Smarter Marketing
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
              Secure data marketplace where sellers upload datasets and buyers explore 
              anonymized insights powered by cutting-edge privacy technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register" className="btn-hero inline-flex items-center">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/marketplace" className="btn-outline text-white border-white hover:bg-white hover:text-primary">
                Explore Datasets
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 slide-up">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Powerful Features for Modern Marketing
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our advanced privacy-preserving technology enables secure data sharing 
              while maintaining complete anonymization and compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-feature text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">
                Trusted by Leading Companies
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join hundreds of companies leveraging our privacy-first approach 
                to unlock valuable marketing insights while maintaining complete data security.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    <span className="font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            {!isAuthenticated && (
              <div className="card-corporate p-8">
                <h3 className="text-2xl font-semibold mb-4">Ready to Get Started?</h3>
                <p className="text-muted-foreground mb-6">
                  Whether you're looking to monetize your data or gain valuable insights, 
                  MarketSafe AI provides the secure platform you need.
                </p>
                <div className="space-y-3">
                  <Link to="/register" className="btn-hero w-full text-center block">
                    Create Account
                  </Link>
                  <Link to="/login" className="btn-outline w-full text-center block">
                    Sign In
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;