import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/MetricCard";
import { GlowScore } from "@/components/GlowScore";
import { Droplets, Flame, Sparkles, Users, Sun, ArrowRight } from "lucide-react";
import { getScanById } from "@/lib/storage";
import { SkinAnalysis } from "@/lib/mockAI";
import { toast } from "sonner";

const Analysis = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const [scan, setScan] = useState<SkinAnalysis | null>(null);

  useEffect(() => {
    if (!scanId) {
      navigate("/");
      return;
    }

    const loadScan = async () => {
      const scanData = await getScanById(scanId);
      if (!scanData) {
        toast.error("Scan not found");
        navigate("/");
        return;
      }

      if (!scanData.unlocked) {
        toast.error("Please unlock this scan first");
        navigate(`/results/${scanId}`);
        return;
      }

      setScan(scanData);
    };

    loadScan();
  }, [scanId, navigate]);

  if (!scan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-glow-pulse">Loading...</div>
      </div>
    );
  }

  const metricIcons = {
    acne: Droplets,
    redness: Flame,
    texture: Sparkles,
    fineLines: Users,
    darkSpots: Sun,
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-white/80 dark:bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-2xl font-bold bg-gradient-glow bg-clip-text text-transparent"
          >
            SkinScan
          </button>
          <Button onClick={() => navigate("/progress")} variant="outline" size="sm">
            View Progress
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 space-y-12">
        {/* Score Overview */}
        <section className="text-center space-y-6 animate-fade-in">
          <h1 className="text-4xl font-bold">Your Complete Skin Analysis</h1>
          <div className="flex justify-center">
            <GlowScore score={scan.glowScore} size="md" animate={false} />
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Below is your detailed breakdown across 5 key skin health metrics. Each score represents different aspects of your skin's condition.
          </p>
        </section>

        {/* Photo Comparison */}
        {scan.imageData && (
          <section className="max-w-4xl mx-auto animate-fade-in">
            <div className="bg-gradient-card rounded-3xl p-8 shadow-card">
              <h2 className="text-2xl font-bold mb-6 text-center">Your Scan</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">Original</p>
                  <img
                    src={scan.imageData}
                    alt="Original scan"
                    className="w-full rounded-xl border-2 border-border"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-3">
                    AI Analysis Overlay
                  </p>
                  <div className="relative">
                    <img
                      src={scan.imageData}
                      alt="Analysis overlay"
                      className="w-full rounded-xl border-2 border-border opacity-90"
                    />
                    <div className="absolute inset-0 bg-primary/10 rounded-xl border-2 border-primary/30 flex items-center justify-center">
                      <div className="bg-background/90 px-4 py-2 rounded-lg">
                        <p className="text-sm font-medium">Heat map visualization</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Skin Concerns Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Areas for Improvement</h2>
            <p className="text-muted-foreground">Lower scores indicate concerns that need attention</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['acne', 'redness', 'fineLines', 'darkSpots'].map((key, index) => {
              const metric = scan.metrics[key as keyof typeof scan.metrics];
              return (
                <div key={key} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <MetricCard
                    title={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                    score={metric.score}
                    severity={metric.severity}
                    description={metric.description}
                    icon={metricIcons[key as keyof typeof metricIcons]}
                    type="concern"
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* Skin Strengths Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Your Skin Strengths</h2>
            <p className="text-muted-foreground">Higher scores show what's working well</p>
          </div>
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6 max-w-md mx-auto">
            <div className="animate-fade-in">
              <MetricCard
                title="Texture"
                score={scan.metrics.texture.score}
                severity={scan.metrics.texture.severity}
                description={scan.metrics.texture.description}
                icon={metricIcons.texture}
                type="strength"
              />
            </div>
          </div>
        </section>

        {/* Recommendations CTA */}
        <section className="max-w-3xl mx-auto">
          <div className="bg-gradient-glow rounded-3xl p-12 text-center shadow-glow">
            <Sparkles className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Get Your Personalized Routine
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Based on your analysis, we've created a custom AM/PM skincare routine with product recommendations
            </p>
            <Button
              size="lg"
              onClick={() => navigate(`/routine/${scanId}`)}
              className="bg-white text-primary hover:bg-white/90 text-lg px-12"
            >
              View My Routine
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* Educational Content */}
        <section className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center">Understanding Your Results</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl p-6 border">
              <h3 className="text-xl font-bold mb-3 text-foreground">What is Glow Score?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Your Glow Score is a comprehensive metric (0-100) that combines all aspects of your skin health. It's calculated using a weighted average of your individual metric scores, with emphasis on clarity and texture.
              </p>
            </div>
            <div className="bg-card rounded-2xl p-6 border">
              <h3 className="text-xl font-bold mb-3 text-foreground">How to Improve</h3>
              <p className="text-muted-foreground leading-relaxed">
                Focus on your "Focus Area" metric first for the biggest impact. Consistency is key - take weekly scans to track progress. Most users see improvement within 4-6 weeks of following their personalized routine.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Analysis;
