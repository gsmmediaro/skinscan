import { Button } from "@/components/ui/button";
import { Camera, TrendingUp, Sparkles, CheckCircle, LogIn, User, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
      setUserEmail(user?.email || "");
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session?.user);
        setUserEmail(session?.user?.email || "");
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    } else {
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/");
    }
  };

  const features = [
    {
      icon: Camera,
      title: "AI Skin Scan",
      description: "Advanced facial analysis in seconds using your phone camera",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your skin health journey with detailed metrics over time",
    },
    {
      icon: Sparkles,
      title: "Get Recommendations",
      description: "Personalized skincare routine based on your unique skin analysis",
    },
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      score: 87,
      text: "SkinScan helped me identify my skin concerns and my Glow Score improved by 15 points in just 2 months!",
    },
    {
      name: "Jessica L.",
      score: 92,
      text: "I love tracking my progress. The AI analysis is incredibly detailed and the recommendations actually work.",
    },
    {
      name: "Emily R.",
      score: 85,
      text: "Finally, a skincare app that gives me actionable insights. My skin has never looked better!",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-8 pb-16">
        {/* Header with Sign In */}
        <div className="flex items-center justify-between mb-12">
          <div className="text-2xl font-bold text-primary">
            SkinScan
          </div>
          {!isAuthenticated ? (
            <Button
              variant="outline"
              onClick={() => navigate("/auth")}
              className="gap-2"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          ) : (
            <div className="relative" ref={menuRef}>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <User className="h-5 w-5" />
              </Button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 space-y-4">
                    <div className="border-b border-border pb-3">
                      <p className="text-sm font-medium text-foreground">Account</p>
                      <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <button
                        className="w-full flex items-center px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors"
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate("/progress");
                        }}
                      >
                        <TrendingUp className="mr-2 h-4 w-4" />
                        My Progress
                      </button>
                      <button
                        className="w-full flex items-center px-3 py-2 text-sm text-foreground hover:bg-accent rounded-md transition-colors"
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate("/scan");
                        }}
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        New Scan
                      </button>
                    </div>
                    
                    <div className="border-t border-border pt-3">
                      <button
                        className="w-full flex items-center px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight">
                Stop Guessing.{" "}
                <span className="bg-gradient-glow bg-clip-text text-transparent">
                  Start Glowing.
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                AI-Powered Skin Analysis. Discover what your skin really needs in 60 seconds. Join 50,000+ users who've transformed their skincare routine.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => navigate("/scan")}
                className="bg-gradient-glow hover:opacity-90 transition-opacity text-lg px-8 shadow-glow"
              >
                <Camera className="mr-2 h-5 w-5" />
                Start Your Glow Up
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/progress")}
                className="text-lg px-8"
              >
                View Demo Results
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">50K+</div>
                <div className="text-sm text-muted-foreground">Scans Done</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">4.8★</div>
                <div className="text-sm text-muted-foreground">User Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">92%</div>
                <div className="text-sm text-muted-foreground">See Results</div>
              </div>
            </div>
          </div>

          <div className="relative animate-scale-in">
            <img
              src={heroImage}
              alt="Woman with glowing skin taking selfie"
              className="rounded-3xl shadow-glow w-full"
            />
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-card rounded-2xl p-6 shadow-glow max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-glow flex items-center justify-center text-white font-bold text-xl">
                  87
                </div>
                <div>
                  <div className="font-bold text-foreground">Excellent!</div>
                  <div className="text-sm text-muted-foreground">Your Glow Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              Your path to healthier, glowing skin in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-card rounded-2xl p-8 shadow-card hover:shadow-glow transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-glow flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Real Journeys, Real Results */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Real Journeys, Real Results</h2>
            <p className="text-xl text-muted-foreground">
              See how users transformed their skin with SkinScan
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-card border rounded-2xl p-6 shadow-card hover:shadow-glow transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full bg-success flex items-center justify-center text-success-foreground font-display font-bold text-xl shadow-lg">
                    {testimonial.score}
                  </div>
                  <div>
                    <div className="font-bold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-success font-semibold">Glow Score: {testimonial.score}</div>
                  </div>
                </div>
                <p className="text-muted-foreground italic mb-4">"{testimonial.text}"</p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-warning text-lg">★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Video testimonials coming soon from our TikTok & Instagram community
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-glow">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Discover Your Glow Score?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are taking control of their skin health with AI-powered insights
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/scan")}
            className="bg-white text-primary hover:bg-white/90 text-lg px-12 shadow-lg"
          >
            <Camera className="mr-2 h-5 w-5" />
            Start Free Scan Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white dark:bg-background border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="text-2xl font-bold bg-gradient-glow bg-clip-text text-transparent mb-2">
                SkinScan
              </div>
              <p className="text-sm text-muted-foreground">
                Your AI-powered skin health companion
              </p>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
              <a href="/contact" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
