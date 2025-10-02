import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, TrendingUp, Calendar, Activity, User, Lightbulb, Bell } from "lucide-react";
import { getScanHistory } from "@/lib/storage";
import { SkinAnalysis } from "@/lib/mockAI";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CircularProgress } from "@/components/CircularProgress";
import { MetricSparklineCard } from "@/components/MetricSparklineCard";
import { format, differenceInDays } from "date-fns";

const Progress = () => {
  const navigate = useNavigate();
  const [scans, setScans] = useState<SkinAnalysis[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      const history = await getScanHistory();
      setScans(history);
    };
    loadHistory();
  }, []);

  const chartData = scans
    .slice()
    .reverse()
    .map((scan) => ({
      date: format(new Date(scan.timestamp), "MMM d"),
      score: scan.glowScore,
    }));

  const latestScore = scans[0]?.glowScore || 0;
  const previousScore = scans[1]?.glowScore || 0;
  const improvement = latestScore - previousScore;
  const totalScans = scans.length;
  const daysActive = scans.length > 0 
    ? differenceInDays(new Date(), new Date(scans[scans.length - 1].timestamp))
    : 0;
  const daysSinceLastScan = scans.length > 0
    ? differenceInDays(new Date(), new Date(scans[0].timestamp))
    : 0;

  // Calculate streak (consecutive scans within 7 days)
  let currentStreak = 0;
  for (let i = 0; i < scans.length - 1; i++) {
    const daysBetween = differenceInDays(
      new Date(scans[i].timestamp),
      new Date(scans[i + 1].timestamp)
    );
    if (daysBetween <= 7) {
      currentStreak++;
    } else {
      break;
    }
  }
  const streakWeeks = Math.floor((currentStreak + 1) / 1); // Simplified for demo

  // Mock metric trends (in real app, would calculate from scan history)
  const getMetricTrend = (metricName: keyof SkinAnalysis['metrics']) => {
    return scans.slice(0, 6).reverse().map(scan => 
      scan.metrics[metricName]?.score || 70
    );
  };

  const getMetricDelta = (metricName: keyof SkinAnalysis['metrics']) => {
    if (scans.length < 2) return 0;
    const current = scans[0].metrics[metricName]?.score || 0;
    const previous = scans[1].metrics[metricName]?.score || 0;
    return current - previous;
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 86) return "bg-success text-success-foreground";
    if (score >= 71) return "bg-warning text-warning-foreground";
    if (score >= 41) return "bg-[hsl(25,95%,61%)] text-white";
    return "bg-danger text-danger-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Navigation Header */}
      <header className="sticky top-0 z-50 bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <button
                onClick={() => navigate("/")}
                className="text-2xl font-bold text-primary"
              >
                SkinScan
              </button>
              <nav className="hidden md:flex items-center gap-6">
                <button 
                  onClick={() => navigate("/progress")}
                  className="text-sm font-medium text-primary border-b-2 border-primary pb-1"
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => navigate("/scan")}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Scans
                </button>
                <button 
                  onClick={() => navigate("/routine")}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Routine
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate("/scan")} className="bg-primary hover:bg-primary/90">
                <Camera className="mr-2 h-4 w-4" />
                New Scan
              </Button>
              <div className="relative">
                <User className="w-8 h-8 text-muted-foreground" />
                {streakWeeks > 0 && (
                  <div className="absolute -top-1 -right-1 bg-success text-success-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {streakWeeks}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-12">
        {scans.length === 0 ? (
          <Card className="p-12 text-center">
            <Camera className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="mb-2">No scans yet</CardTitle>
            <CardDescription className="mb-6">
              Take your first scan to start tracking your skin health journey
            </CardDescription>
            <Button onClick={() => navigate("/scan")} className="bg-primary">
              <Camera className="mr-2 h-4 w-4" />
              Take First Scan
            </Button>
          </Card>
        ) : (
          <>
            {/* Hero Stats Section */}
            <section className="grid md:grid-cols-4 gap-6">
              <Card className="md:col-span-2 p-8 flex items-center justify-center">
                <CircularProgress
                  score={latestScore}
                  delta={improvement}
                  subtext={`Last scanned ${daysSinceLastScan} ${daysSinceLastScan === 1 ? 'day' : 'days'} ago`}
                />
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Total Scans</CardDescription>
                  <CardTitle className="text-4xl">{totalScans}</CardTitle>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardDescription>Days Active</CardDescription>
                  <CardTitle className="text-4xl">{daysActive}</CardTitle>
                </CardHeader>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="pb-3">
                  <CardDescription>Current Streak</CardDescription>
                  <CardTitle className="text-4xl">{streakWeeks} {streakWeeks === 1 ? 'week' : 'weeks'}</CardTitle>
                </CardHeader>
              </Card>
            </section>

            {/* Progress Timeline */}
            {scans.length > 1 && (
              <section>
                <Card className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Activity className="w-6 h-6 text-primary" />
                        Your Skin Health Journey
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        Track your progress over time
                      </p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        style={{ fontSize: '12px' }}
                      />
                      <YAxis 
                        domain={[0, 100]} 
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        style={{ fontSize: '12px' }}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </section>
            )}

            {/* Metric Breakdown */}
            {scans.length > 0 && (
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">Metric Breakdown</h2>
                  <p className="text-sm text-muted-foreground">Individual metrics and their 30-day trends</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  <MetricSparklineCard
                    title="Acne"
                    currentScore={scans[0].metrics.acne?.score || 0}
                    trend={getMetricTrend('acne')}
                    delta={getMetricDelta('acne')}
                    onClick={() => navigate(`/analysis/${scans[0].id}`)}
                  />
                  <MetricSparklineCard
                    title="Redness"
                    currentScore={scans[0].metrics.redness?.score || 0}
                    trend={getMetricTrend('redness')}
                    delta={getMetricDelta('redness')}
                    onClick={() => navigate(`/analysis/${scans[0].id}`)}
                  />
                  <MetricSparklineCard
                    title="Texture"
                    currentScore={scans[0].metrics.texture?.score || 0}
                    trend={getMetricTrend('texture')}
                    delta={getMetricDelta('texture')}
                    onClick={() => navigate(`/analysis/${scans[0].id}`)}
                  />
                  <MetricSparklineCard
                    title="Fine Lines"
                    currentScore={scans[0].metrics.fineLines?.score || 0}
                    trend={getMetricTrend('fineLines')}
                    delta={getMetricDelta('fineLines')}
                    onClick={() => navigate(`/analysis/${scans[0].id}`)}
                  />
                  <MetricSparklineCard
                    title="Dark Spots"
                    currentScore={scans[0].metrics.darkSpots?.score || 0}
                    trend={getMetricTrend('darkSpots')}
                    delta={getMetricDelta('darkSpots')}
                    onClick={() => navigate(`/analysis/${scans[0].id}`)}
                  />
                </div>
              </section>
            )}

            {/* AI Insights */}
            <section>
              <Card className="bg-accent/5 border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    Insights & Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-success mt-2" />
                    <p className="text-sm">
                      Your texture score improved 15% after introducing vitamin C serum
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <p className="text-sm">
                      You scan most consistently on Monday mornings
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-warning mt-2" />
                    <p className="text-sm">
                      Consider focusing on dark spots next for maximum impact
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Recent Scans */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-primary" />
                    Scan History
                  </h2>
                  <p className="text-sm text-muted-foreground">Your recent skin scans</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {scans.map((scan, index) => {
                  const prevScan = scans[index + 1];
                  const delta = prevScan ? scan.glowScore - prevScan.glowScore : 0;
                  
                  return (
                    <Card
                      key={scan.id}
                      className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
                      onClick={() => navigate(scan.unlocked ? `/analysis/${scan.id}` : `/results/${scan.id}`)}
                    >
                      {scan.imageData && (
                        <div className="relative aspect-video overflow-hidden bg-muted">
                          <img
                            src={scan.imageData}
                            alt="Scan"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 right-3">
                            <div className={`${getScoreColorClass(scan.glowScore)} rounded-full px-3 py-1 text-sm font-bold shadow-lg`}>
                              {scan.glowScore}
                            </div>
                          </div>
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="text-sm font-medium">
                              {format(new Date(scan.timestamp), "MMM d, yyyy")}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(scan.timestamp), "h:mm a")}
                            </div>
                          </div>
                          {delta !== 0 && (
                            <div className={`text-xs font-medium ${delta > 0 ? 'text-success' : 'text-danger'}`}>
                              {delta > 0 ? '+' : ''}{delta}
                            </div>
                          )}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                        >
                          View Analysis →
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* CTA Section */}
            <section>
              <Card className="bg-card border">
                <CardContent className="p-8 text-center">
                  <h2 className="text-2xl font-bold mb-2">Ready for your next scan?</h2>
                  <p className="text-muted-foreground mb-1">
                    We recommend scanning every 3-5 days for best results
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    It's been {daysSinceLastScan} {daysSinceLastScan === 1 ? 'day' : 'days'} since your last scan
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <Button 
                      onClick={() => navigate("/scan")}
                      size="lg"
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      Scan Now
                    </Button>
                    <Button 
                      variant="ghost"
                      size="lg"
                      className="text-primary"
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Adjust scan reminders
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Progress;
