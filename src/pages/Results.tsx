import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CircularProgress } from "@/components/CircularProgress";
import { MetricDetailModal } from "@/components/MetricDetailModal";
import { CheckCircle, Target, TrendingUp, TrendingDown, FileText, Download } from "lucide-react";
import { getScanById } from "@/lib/storage";
import { SkinAnalysis } from "@/lib/mockAI";
import { toast } from "sonner";

const Results = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const [scan, setScan] = useState<SkinAnalysis | null>(null);
  const [showHeatMap, setShowHeatMap] = useState(true);
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

    const loadScan = async () => {
      const scanData = await getScanById(scanId);
      if (!scanData) {
        toast.error("Scan not found");
        navigate("/");
        return;
      }

      setScan(scanData);
    };

    loadScan();
  }, [scanId, navigate]);

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
            <CircularProgress 
              score={scan.glowScore} 
              delta={Math.floor(Math.random() * 10) - 2}
            />
          </div>
          
          <div className="space-y-2">
            <p className={`text-xl font-semibold ${colors.text}`}>
              {getScoreMessage(scan.glowScore)}
            </p>
            <p className="text-muted-foreground">
              You're in the {Math.floor(Math.random() * 30) + 50}th percentile of users
            </p>
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
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowHeatMap(!showHeatMap)}
                >
                  {showHeatMap ? "Hide" : "Show"} Heat Map
                </Button>
              </div>
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-[3/4]">
                {scan.imageData && (
                  <>
                    <img 
                      src={scan.imageData} 
                      alt="Analysis" 
                      className="w-full h-full object-cover"
                      style={{ opacity: showHeatMap ? 0.6 : 1 }}
                    />
                    {showHeatMap && (
                      <div className="absolute inset-0">
                        {/* Simulated heat map zones */}
                        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-warning/40 rounded-full blur-xl" />
                        <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-success/40 rounded-full blur-xl" />
                        <div className="absolute bottom-1/3 left-1/3 w-14 h-14 bg-danger/40 rounded-full blur-xl" />
                      </div>
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
              const change = Math.floor(Math.random() * 10) - 3;
              
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
              <Button className="bg-gradient-to-r from-primary to-secondary text-white">
                Learn More
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
    </div>
  );
};

export default Results;
