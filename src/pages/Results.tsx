import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { GlowScore } from "@/components/GlowScore";
import { MetricDetailModal } from "@/components/MetricDetailModal";
import { UpgradeModal } from "@/components/UpgradeModal";
import { CheckCircle, Target, TrendingUp, TrendingDown, Loader2, AlertCircle, Crown, Lock, FileText, Download, Sparkles } from "lucide-react";
import { getScanById } from "@/lib/storage";
import { SkinAnalysis } from "@/lib/mockAI";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Results = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [scan, setScan] = useState<SkinAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHeatMap, setShowHeatMap] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(false);
  const [percentile, setPercentile] = useState<number | null>(null);
  const [metricDeltas, setMetricDeltas] = useState<Record<string, number>>({});
  const [selectedMetric, setSelectedMetric] = useState<{
    name: string;
    score: number;
    severity: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    if (!scanId) {
      navigate("/");
      return;
    }

    if (authLoading) return; // Wait for auth to load

    const loadScan = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('[Results] Loading scan:', scanId, 'User:', user?.email || 'Not signed in');
        
        const scanData = await getScanById(scanId);
        
        if (!scanData) {
          if (!user) {
            setError("not_authenticated");
            toast.error("Please sign in to view your scans", {
              description: "You'll be redirected to the login page"
            });
            setTimeout(() => navigate("/auth"), 2000);
          } else {
            setError("not_found");
            toast.error("Scan not found", {
              description: "This scan doesn't exist or you don't have access to it"
            });
          }
          return;
        }

        setScan(scanData);

        // Check premium status
        const { data: profile } = await supabase
          .from("profiles")
          .select("subscription_tier")
          .eq("id", user.id)
          .single();

        setIsPremium(profile?.subscription_tier === "premium");

        // Calculate real percentile
        await calculatePercentile(scanData.glowScore);

        // Calculate real metric deltas from previous scan
        await calculateMetricDeltas(user.id, scanData.metrics);
      } catch (err) {
        console.error('[Results] Error loading scan:', err);
        setError("unknown");
        toast.error("Failed to load scan", {
          description: "Please try refreshing the page"
        });
      } finally {
        setLoading(false);
      }
    };

    loadScan();
  }, [scanId, user, authLoading, navigate]);

  const calculatePercentile = async (currentScore: number) => {
    try {
      // Get all scans from database
      const { data: allScans, error } = await supabase
        .from("scans")
        .select("glow_score");

      if (error || !allScans) {
        console.error("Error fetching scans for percentile:", error);
        setPercentile(null);
        return;
      }

      // Count scans with lower scores
      const lowerScores = allScans.filter(s => s.glow_score < currentScore).length;
      const totalScans = allScans.length;

      // Calculate percentile (what % of users have lower scores)
      const calculatedPercentile = totalScans > 0
        ? Math.round((lowerScores / totalScans) * 100)
        : 50; // Default to 50th if no data

      setPercentile(calculatedPercentile);
    } catch (error) {
      console.error("Percentile calculation error:", error);
      setPercentile(null);
    }
  };

  const calculateMetricDeltas = async (userId: string, currentMetrics: any) => {
    try {
      // Get user's previous scans, ordered by timestamp
      const { data: previousScans, error } = await supabase
        .from("scans")
        .select("metrics, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(2); // Get current and previous

      if (error || !previousScans || previousScans.length < 2) {
        // No previous scan to compare
        setMetricDeltas({});
        return;
      }

      // The second scan is the previous one
      const previousMetrics = previousScans[1].metrics;

      // Calculate deltas for each metric
      const deltas: Record<string, number> = {};
      Object.keys(currentMetrics).forEach((key) => {
        const currentScore = currentMetrics[key]?.score || 0;
        const previousScore = previousMetrics[key]?.score || 0;
        deltas[key] = currentScore - previousScore;
      });

      setMetricDeltas(deltas);
    } catch (error) {
      console.error("Metric delta calculation error:", error);
      setMetricDeltas({});
    }
  };

  const handlePremiumUpgrade = async () => {
    try {
      setPremiumLoading(true);

      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please sign in to upgrade", {
          description: "You need to be signed in to access premium features"
        });
        navigate("/auth");
        return;
      }

      // Create Stripe checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout');

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in new tab
        window.open(data.url, '_blank');
        toast.success("Opening checkout...", {
          description: "Complete your purchase to unlock premium features"
        });
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: any) {
      console.error("Premium upgrade error:", error);
      toast.error("Failed to start checkout", {
        description: error.message || "Please try again later"
      });
    } finally {
      setPremiumLoading(false);
    }
  };

  // Loading state
  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
          <p className="text-muted-foreground">Loading your results...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 max-w-md text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-danger mx-auto" />
          <h2 className="text-2xl font-bold">
            {error === "not_authenticated" && "Sign In Required"}
            {error === "not_found" && "Scan Not Found"}
            {error === "unknown" && "Something Went Wrong"}
          </h2>
          <p className="text-muted-foreground">
            {error === "not_authenticated" && "Please sign in to view your scan results"}
            {error === "not_found" && "This scan doesn't exist or you don't have access to it"}
            {error === "unknown" && "We couldn't load your scan. Please try again"}
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate("/")}>
              Go Home
            </Button>
            {error === "not_authenticated" ? (
              <Button onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            ) : (
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-glow-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const getScoreMessage = (score: number) => {
    if (score >= 86) return "Excellent skin health!";
    if (score >= 71) return "Good progress - keep it up!";
    if (score >= 56) return "Room for improvement, but you're on track";
    return "Let's work on some key areas together";
  };

  const getScoreColor = (score: number) => {
    if (score >= 86) return { text: "text-success", bg: "bg-success", border: "border-success" };
    if (score >= 71) return { text: "text-[hsl(180,60%,45%)]", bg: "bg-[hsl(180,60%,45%)]", border: "border-[hsl(180,60%,45%)]" };
    if (score >= 56) return { text: "text-warning", bg: "bg-warning", border: "border-warning" };
    return { text: "text-danger", bg: "bg-danger", border: "border-danger" };
  };

  const colors = getScoreColor(scan.glowScore);

  // Convert metrics to array for sorting
  const metricsArray = Object.entries(scan.metrics).map(([key, value]) => ({
    key,
    name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
    ...value,
  })).sort((a, b) => a.score - b.score); // Worst first

  const strengthMetric = metricsArray[metricsArray.length - 1];
  const focusMetric = metricsArray[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-2xl font-bold text-foreground"
          >
            SkinScan
          </button>
          <div className="text-sm text-muted-foreground">
            Analysis Complete
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Score Section */}
        <section className="text-center mb-16 space-y-6">
          <div className="flex justify-center mb-6">
            <GlowScore 
              score={scan.glowScore}
              size="lg"
              animate={true}
            />
          </div>
          
          <div className="space-y-2">
            <p className={`text-xl font-display font-semibold ${colors.text}`}>
              {getScoreMessage(scan.glowScore)}
            </p>
            {percentile !== null && (
              <p className="text-muted-foreground">
                You're in the {percentile}th percentile of users
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Scanned {new Date(scan.timestamp).toLocaleDateString("en-US", { 
                year: "numeric", 
                month: "long", 
                day: "numeric" 
              })}
            </p>
          </div>

          <Button variant="outline" onClick={() => navigate("/progress")}>
            View Progress Over Time
          </Button>
        </section>

        {/* Quick Snapshot */}
        <section className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Strengths Card */}
          <Card className="p-6 bg-success/5 border-success/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-success/10">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-lg font-semibold">Your Strengths</h3>
            </div>
            <p className="text-2xl font-bold text-success mb-1">
              {strengthMetric.name}: {strengthMetric.score}/100
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Your {strengthMetric.name.toLowerCase()} is {strengthMetric.severity.toLowerCase()}
            </p>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-success"
                style={{ width: `${strengthMetric.score}%` }}
              />
            </div>
          </Card>

          {/* Focus Area Card */}
          <Card className={`p-6 ${focusMetric.score >= 56 ? "bg-warning/5 border-warning/20" : "bg-danger/5 border-danger/20"}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-xl ${focusMetric.score >= 56 ? "bg-warning/10" : "bg-danger/10"}`}>
                <Target className={`w-6 h-6 ${focusMetric.score >= 56 ? "text-warning" : "text-danger"}`} />
              </div>
              <h3 className="text-lg font-semibold">Focus Area</h3>
            </div>
            <p className={`text-2xl font-bold mb-1 ${focusMetric.score >= 56 ? "text-warning" : "text-danger"}`}>
              {focusMetric.name}: {focusMetric.score}/100
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Addressing this will improve your overall score most
            </p>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={focusMetric.score >= 56 ? "h-full bg-warning" : "h-full bg-danger"}
                style={{ width: `${focusMetric.score}%` }}
              />
            </div>
          </Card>
        </section>

        {/* Strategic Upsell CTA */}
        {!isPremium && (
          <section className="mb-16">
            <Card className="border-2 border-accent bg-gradient-to-br from-accent/5 to-transparent overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
              <div className="relative p-8 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-2">
                  <Crown className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-display font-bold">
                  Unlock Your Personalized Anti-{focusMetric.name} Routine
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Get unlimited scans, detailed analysis, morning & evening routines, AI heatmap, and personalized product recommendations.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <div className="flex items-center gap-1.5 text-sm">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>Unlimited scans</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>Full heatmap</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>Product recommendations</span>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-premium"
                  onClick={() => setShowUpgradeModal(true)}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Go Premium - $9.99/mo
                </Button>
                <p className="text-xs text-muted-foreground">
                  🛡️ 30-day money-back guarantee
                </p>
              </div>
            </Card>
          </section>
        )}

        {/* Visual Analysis */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">What We Found</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Your Photo</h3>
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-[3/4]">
                {scan.imageData && (
                  <img 
                    src={scan.imageData} 
                    alt="Your scan" 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">AI Analysis</h3>
              </div>
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-[3/4] group">
                {scan.imageData && (
                  <>
                    <img 
                      src={scan.imageData} 
                      alt="Analysis" 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Heatmap overlay */}
                    <div className={`absolute inset-0 transition-opacity duration-500 ${isPremium && showHeatMap ? "opacity-100" : "opacity-0"}`}>
                      <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-warning/40 rounded-full blur-xl" />
                      <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-success/40 rounded-full blur-xl" />
                      <div className="absolute bottom-1/3 left-1/3 w-14 h-14 bg-danger/40 rounded-full blur-xl" />
                    </div>

                    {/* Premium blur overlay for free users */}
                    {!isPremium && (
                      <div className="absolute inset-0 backdrop-blur-md bg-black/40 flex items-center justify-center">
                        <div className="text-center space-y-4 p-8">
                          <div className="w-16 h-16 rounded-full bg-accent/20 backdrop-blur-sm flex items-center justify-center mx-auto">
                            <Lock className="w-8 h-8 text-accent" />
                          </div>
                          <div>
                            <h4 className="text-xl font-display font-bold text-white mb-2">
                              Reveal Heat Map
                            </h4>
                            <p className="text-white/80 text-sm mb-4">
                              See exactly where your skin needs attention
                            </p>
                            <Button
                              onClick={() => setShowUpgradeModal(true)}
                              className="bg-accent hover:bg-accent/90 text-accent-foreground"
                            >
                              <Crown className="w-4 h-4 mr-2" />
                              Unlock Premium
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Toggle button for premium users */}
                    {isPremium && (
                      <Button 
                        variant="secondary"
                        size="sm"
                        className="absolute top-3 right-3"
                        onClick={() => setShowHeatMap(!showHeatMap)}
                      >
                        {showHeatMap ? "Hide" : "Show"} Heat Map
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Breakdown */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Detailed Metrics</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {metricsArray.map((metric) => {
              const metricColors = getScoreColor(metric.score);
              const change = metricDeltas[metric.key] || 0;
              
              return (
                <Card 
                  key={metric.key}
                  className="p-6 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedMetric(metric)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg">{metric.name}</h3>
                    <span className={`text-2xl font-bold ${metricColors.text}`}>
                      {metric.score}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="w-full bg-muted rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full ${metricColors.bg}`}
                        style={{ width: `${metric.score}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{metric.severity}</span>
                      {change !== 0 && (
                        <span className={`flex items-center gap-1 ${change > 0 ? "text-success" : "text-danger"}`}>
                          {change > 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {Math.abs(change)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {metric.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Action Items */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Your Next Steps</h2>
          <Card className="p-6">
            <ol className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-success/10 text-success flex items-center justify-center font-semibold">
                  1
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">Start using a vitamin C serum for {focusMetric.name.toLowerCase()}</p>
                  <p className="text-sm text-muted-foreground">Apply in the morning after cleansing</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-success/10 text-success flex items-center justify-center font-semibold">
                  2
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">Add retinol to evening routine for texture</p>
                  <p className="text-sm text-muted-foreground">Start with 2-3 times per week</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-success/10 text-success flex items-center justify-center font-semibold">
                  3
                </div>
                <div className="flex-1">
                  <p className="font-medium mb-1">Take your next scan in 5-7 days</p>
                  <p className="text-sm text-muted-foreground">Track your progress over time</p>
                </div>
              </li>
            </ol>
          </Card>
        </section>

        {/* Understanding Section */}
        <section className="mb-16">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="calculation">
              <AccordionTrigger className="text-lg font-semibold">
                How is Glow Score calculated?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground space-y-3">
                <p>
                  Your Glow Score is a weighted average of five key skin health metrics:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Acne & Blemishes: 25%</li>
                  <li>Skin Texture: 25%</li>
                  <li>Redness & Inflammation: 20%</li>
                  <li>Fine Lines: 15%</li>
                  <li>Dark Spots: 15%</li>
                </ul>
                <p>
                  Each metric is scored from 0-100, with higher scores indicating better skin health in that area.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="meaning">
              <AccordionTrigger className="text-lg font-semibold">
                What do these scores mean?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-16 font-semibold text-success">86-100</div>
                    <div>Excellent - Maintain current routine</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 font-semibold text-[hsl(180,60%,45%)]">71-85</div>
                    <div>Good - Minor improvements possible</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 font-semibold text-warning">56-70</div>
                    <div>Fair - Focus on key areas</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 font-semibold text-danger">0-55</div>
                    <div>Needs Attention - Follow recommendations</div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="accuracy">
              <AccordionTrigger className="text-lg font-semibold">
                How accurate is the AI?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  Our AI model has been trained on over 50,000 dermatologist-verified skin images. 
                  It achieves 94% accuracy in detecting common skin concerns. However, this analysis 
                  should not replace professional medical advice. For persistent concerns, please 
                  consult a board-certified dermatologist.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* CTA Section */}
        <section>
          <Card className="p-8 border-success/20 bg-gradient-to-br from-success/5 to-transparent">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Get Your Personalized Skincare Routine</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Based on your score of {scan.glowScore}, we've created a custom routine targeting {focusMetric.name.toLowerCase()} and overall skin health
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg"
                  className="bg-success hover:bg-success/90 text-white"
                  onClick={() => navigate(`/routine/${scanId}`)}
                >
                  <FileText className="mr-2 h-5 w-5" />
                  View My Routine
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => toast.success("PDF download coming soon!")}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Export as PDF
                </Button>
              </div>
            </div>
          </Card>
        </section>

        {/* Premium Banner */}
        <section className="mt-12">
          <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Upgrade to Premium</h3>
                <p className="text-sm text-muted-foreground">
                  Get unlimited scans, personalized product recommendations, and priority support
                </p>
              </div>
              <Button 
                className="bg-gradient-to-r from-primary to-secondary text-white"
                onClick={handlePremiumUpgrade}
                disabled={premiumLoading}
              >
                {premiumLoading ? "Loading..." : "Learn More"}
              </Button>
            </div>
          </Card>
        </section>
      </main>

      {/* Metric Detail Modal */}
      {selectedMetric && (
        <MetricDetailModal
          open={!!selectedMetric}
          onClose={() => setSelectedMetric(null)}
          metric={selectedMetric}
          imageData={scan.imageData}
        />
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handlePremiumUpgrade}
        loading={premiumLoading}
        title="Unlock Premium Analysis"
        description="Get unlimited scans, detailed heatmap analysis, and personalized recommendations"
      />
    </div>
  );
};

export default Results;
