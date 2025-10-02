import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RoutineStepCard } from "@/components/RoutineStepCard";
import { RoutineTimeline } from "@/components/RoutineTimeline";
import { ProgressTracker } from "@/components/ProgressTracker";
import { 
  ArrowLeft, 
  Download, 
  Mail, 
  AlertCircle, 
  Calendar,
  RefreshCw,
  TrendingUp,
  ChevronRight
} from "lucide-react";
import { getScanById } from "@/lib/storage";
import { SkinAnalysis } from "@/lib/mockAI";
import { toast } from "sonner";

const Routine = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const [scan, setScan] = useState<SkinAnalysis | null>(null);
  const [routineLength, setRoutineLength] = useState("standard");
  const [budget, setBudget] = useState("$$");

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

  const metricScores = Object.entries(scan.metrics).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
    score: value.score,
  }));
  const sortedMetrics = [...metricScores].sort((a, b) => a.score - b.score);
  const focusArea1 = sortedMetrics[0];
  const focusArea2 = sortedMetrics[1];

  // Mock product data
  const morningProducts = {
    cleanser: [
      {
        name: "Hydrating Facial Cleanser",
        brand: "CeraVe",
        price: "$" as const,
        ingredients: ["Hyaluronic Acid", "Ceramides"],
        reason: "Gentle formula won't strip natural oils",
        rating: 5,
        reviews: 4521,
        image: "",
        url: "#"
      },
      {
        name: "Toleriane Hydrating Cleanser",
        brand: "La Roche-Posay",
        price: "$$" as const,
        ingredients: ["Niacinamide", "Ceramides"],
        reason: "Dermatologist recommended for sensitive skin",
        rating: 5,
        reviews: 2890,
        image: "",
        url: "#"
      }
    ],
    vitaminC: [
      {
        name: "Vitamin C Suspension 23%",
        brand: "The Ordinary",
        price: "$" as const,
        ingredients: ["L-Ascorbic Acid"],
        reason: "High concentration for dark spots",
        rating: 4,
        reviews: 8234,
        image: "",
        url: "#"
      },
      {
        name: "C E Ferulic",
        brand: "SkinCeuticals",
        price: "$$$" as const,
        ingredients: ["L-Ascorbic Acid", "Vitamin E", "Ferulic Acid"],
        reason: "Gold standard antioxidant protection",
        rating: 5,
        reviews: 1456,
        image: "",
        url: "#"
      }
    ],
    moisturizer: [
      {
        name: "Hydro Boost Water Gel",
        brand: "Neutrogena",
        price: "$" as const,
        ingredients: ["Hyaluronic Acid"],
        reason: "Lightweight hydration",
        rating: 5,
        reviews: 5678,
        image: "",
        url: "#"
      }
    ],
    sunscreen: [
      {
        name: "Unseen Sunscreen SPF 40",
        brand: "Supergoop!",
        price: "$$" as const,
        ingredients: ["Zinc Oxide"],
        reason: "Clear finish, works under makeup",
        rating: 5,
        reviews: 3421,
        image: "",
        url: "#"
      },
      {
        name: "UV Clear SPF 46",
        brand: "EltaMD",
        price: "$$" as const,
        ingredients: ["Zinc Oxide", "Niacinamide"],
        reason: "Calms redness while protecting",
        rating: 5,
        reviews: 2134,
        image: "",
        url: "#"
      }
    ]
  };

  const morningSteps = [
    { name: "Cleanser", duration: "30 sec" },
    { name: "Vitamin C", duration: "1 min" },
    { name: "Moisturizer", duration: "1 min" },
    { name: "Sunscreen", duration: "1 min" }
  ];

  const eveningSteps = [
    { name: "Cleanse", duration: "1 min" },
    { name: "Exfoliate", duration: "30 sec" },
    { name: "Treatment", duration: "1 min" },
    { name: "Night Cream", duration: "1 min" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white dark:bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="text-2xl font-bold text-foreground"
              >
                SkinScan
              </button>
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <span 
                  className="hover:text-foreground cursor-pointer"
                  onClick={() => navigate(`/results/${scanId}`)}
                >
                  Analysis
                </span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-foreground font-medium">Routine</span>
              </div>
            </div>
            <Button onClick={() => navigate(`/results/${scanId}`)} variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          {/* Main Content */}
          <div className="space-y-8">
            {/* Hero Section */}
            <section>
              <h1 className="text-4xl font-bold mb-4">Your Personalized Skincare Routine</h1>
              
              <Card className="p-6 bg-gradient-to-br from-success/5 to-transparent border-success/20">
                <div className="space-y-3">
                  <p className="text-lg">
                    <span className="font-semibold">Based on your Glow Score of {scan.glowScore}</span>
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-semibold">Targeting:</span> {focusArea1.name} ({focusArea1.score}/100) and {focusArea2.name} ({focusArea2.score}/100)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold">Estimated results:</span> Visible improvement in 4-6 weeks with consistency
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last updated: {new Date(scan.timestamp).toLocaleDateString("en-US", { 
                      year: "numeric", 
                      month: "long", 
                      day: "numeric" 
                    })}
                  </p>
                </div>
              </Card>
            </section>

            {/* Warning Card */}
            <Card className="p-6 bg-danger/5 border-danger/20">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-danger">Before You Start</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Patch test new products before full use</li>
                    <li>• Introduce one new product at a time (wait 1-2 weeks)</li>
                    <li>• Some ingredients (retinol) may cause initial purging</li>
                    <li>• Always use SPF when using active ingredients</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Routine Tabs */}
            <Tabs defaultValue="morning" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="morning">Morning</TabsTrigger>
                <TabsTrigger value="evening">Evening</TabsTrigger>
                <TabsTrigger value="weekly">Weekly Treatments</TabsTrigger>
              </TabsList>

              <TabsContent value="morning" className="space-y-6 mt-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Morning Routine (8-10 minutes)</h2>
                  <p className="text-muted-foreground mb-6">Protect and prepare your skin for the day</p>
                  
                  <RoutineTimeline steps={morningSteps} totalTime="8-10 min" />
                </div>

                <div className="space-y-6">
                  <RoutineStepCard
                    stepNumber={1}
                    stepName="Cleanser"
                    why="Removes overnight oils without stripping skin's natural barrier"
                    howTo="Massage onto damp skin for 30 seconds in circular motions. Rinse with lukewarm water and pat dry."
                    waitTime="None needed"
                    products={morningProducts.cleanser}
                    videoUrl="#"
                  />

                  <RoutineStepCard
                    stepNumber={2}
                    stepName="Vitamin C Serum"
                    why="Brightens skin, fades dark spots, and provides antioxidant protection"
                    howTo="Apply 3-4 drops to face and neck. Gently press into skin, avoiding eye area."
                    waitTime="Wait 1-2 minutes to absorb"
                    products={morningProducts.vitaminC}
                  />

                  <RoutineStepCard
                    stepNumber={3}
                    stepName="Moisturizer"
                    why="Locks in hydration and strengthens skin barrier"
                    howTo="Apply a dime-sized amount evenly across face and neck while skin is still damp."
                    waitTime="Wait 1 minute"
                    products={morningProducts.moisturizer}
                  />

                  <RoutineStepCard
                    stepNumber={4}
                    stepName="Sunscreen SPF 30+"
                    why="Critical for preventing dark spots, aging, and skin damage"
                    howTo="Apply generous amount (¼ teaspoon) to face and neck. Reapply every 2 hours if outdoors."
                    waitTime="Wait 15 minutes before sun exposure"
                    products={morningProducts.sunscreen}
                  />
                </div>
              </TabsContent>

              <TabsContent value="evening" className="space-y-6 mt-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Evening Routine (10-12 minutes)</h2>
                  <p className="text-muted-foreground mb-6">Repair and regenerate overnight</p>
                  
                  <RoutineTimeline steps={eveningSteps} totalTime="10-12 min" />
                </div>

                <div className="space-y-6">
                  <RoutineStepCard
                    stepNumber={1}
                    stepName="Double Cleanse"
                    why="First removes SPF and makeup, second cleanses skin"
                    howTo="Start with oil cleanser on dry skin, massage for 1 minute. Rinse. Follow with water-based cleanser."
                    waitTime="None needed"
                    products={morningProducts.cleanser}
                  />

                  <RoutineStepCard
                    stepNumber={2}
                    stepName="Exfoliant (2-3x per week)"
                    why="Removes dead skin cells, improves texture and absorption"
                    howTo="Apply thin layer, leave for 5-10 minutes. Rinse thoroughly."
                    waitTime="None needed"
                    products={[]}
                  />

                  <RoutineStepCard
                    stepNumber={3}
                    stepName="Treatment Serum"
                    why="Retinol boosts cell turnover, reduces fine lines and texture"
                    howTo="Apply pea-sized amount. Start 2-3x per week, increase gradually."
                    waitTime="Wait 2-3 minutes"
                    products={[]}
                  />

                  <RoutineStepCard
                    stepNumber={4}
                    stepName="Night Moisturizer"
                    why="Richer formula supports overnight repair and hydration"
                    howTo="Apply generously to face and neck. Layer over treatment serum."
                    waitTime="None needed"
                    products={[]}
                  />
                </div>
              </TabsContent>

              <TabsContent value="weekly" className="space-y-6 mt-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Weekly Treatments</h2>
                  <p className="text-muted-foreground mb-6">Optional add-ons for enhanced results</p>
                </div>

                <div className="space-y-4">
                  <Card className="p-6">
                    <h3 className="font-semibold mb-2">Sheet Masks (1-2x per week)</h3>
                    <p className="text-sm text-muted-foreground">
                      Boost hydration and address specific concerns. Use after cleansing, before serums.
                    </p>
                  </Card>

                  <Card className="p-6">
                    <h3 className="font-semibold mb-2">Spot Treatments (As needed)</h3>
                    <p className="text-sm text-muted-foreground">
                      Apply directly to blemishes or dark spots after cleansing. Leave on overnight.
                    </p>
                  </Card>

                  <Card className="p-6">
                    <h3 className="font-semibold mb-2">Exfoliating Mask (1x per week)</h3>
                    <p className="text-sm text-muted-foreground">
                      Deep exfoliation for texture and brightness. Use on evening when not using retinol.
                    </p>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            {/* Results Timeline */}
            <section>
              <h2 className="text-2xl font-bold mb-6">What to Expect</h2>
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-20 text-center">
                      <div className="font-bold text-success">Week 1-2</div>
                    </div>
                    <div className="flex-1 border-l-2 border-success pl-4">
                      <p className="font-medium mb-1">Adjustment Period</p>
                      <p className="text-sm text-muted-foreground">
                        Skin adjusting to new products. Possible purging if using actives like retinol.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-20 text-center">
                      <div className="font-bold text-success">Week 3-4</div>
                    </div>
                    <div className="flex-1 border-l-2 border-success pl-4">
                      <p className="font-medium mb-1">Early Improvements</p>
                      <p className="text-sm text-muted-foreground">
                        Reduced redness, improved texture. Skin feeling more balanced.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-20 text-center">
                      <div className="font-bold text-success">Week 5-8</div>
                    </div>
                    <div className="flex-1 border-l-2 border-success pl-4">
                      <p className="font-medium mb-1">Visible Fading</p>
                      <p className="text-sm text-muted-foreground">
                        Dark spots beginning to fade. Overall tone more even.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-20 text-center">
                      <div className="font-bold text-success">Week 8-12</div>
                    </div>
                    <div className="flex-1 border-l-2 border-success pl-4">
                      <p className="font-medium mb-1">Significant Results</p>
                      <p className="text-sm text-muted-foreground">
                        Noticeable improvement in target areas. Higher Glow Score expected.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-muted-foreground">
                    💡 Take weekly scans to objectively track your progress
                  </p>
                </div>
              </Card>
            </section>

            {/* Key Ingredients */}
            <section>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="ingredients">
                  <AccordionTrigger className="text-lg font-semibold">
                    Understanding Your Ingredients
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <Card className="p-4">
                      <h4 className="font-semibold mb-2">Niacinamide</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Reduces redness, minimizes pores, and fades dark spots
                      </p>
                      <p className="text-xs text-success">
                        ✓ Recommended for your redness concerns
                      </p>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-semibold mb-2">Vitamin C (L-Ascorbic Acid)</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Brightens skin, protects from environmental damage, fades hyperpigmentation
                      </p>
                      <p className="text-xs text-success">
                        ✓ Recommended for your dark spots
                      </p>
                    </Card>

                    <Card className="p-4">
                      <h4 className="font-semibold mb-2">Retinol</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Increases cell turnover, reduces fine lines, improves texture
                      </p>
                      <p className="text-xs text-success">
                        ✓ Gold standard anti-aging ingredient
                      </p>
                    </Card>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="faq">
                  <AccordionTrigger className="text-lg font-semibold">
                    Frequently Asked Questions
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div>
                      <p className="font-medium mb-2">Can I use products I already own?</p>
                      <p className="text-sm text-muted-foreground">
                        Yes! Check if they contain the recommended ingredients and serve the same purpose. The specific products listed are suggestions.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium mb-2">What if I have a reaction?</p>
                      <p className="text-sm text-muted-foreground">
                        Stop using the product immediately. If severe, consult a dermatologist. Always patch test new products on your inner arm first.
                      </p>
                    </div>

                    <div>
                      <p className="font-medium mb-2">Do I need all these products?</p>
                      <p className="text-sm text-muted-foreground">
                        Minimum routine: Cleanser, moisturizer, and SPF. For best results targeting your concerns, follow the complete routine.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            {/* CTA Section */}
            <section className="space-y-4">
              <Card className="p-8 bg-gradient-to-br from-success/10 to-transparent border-success/20 text-center">
                <TrendingUp className="w-12 h-12 text-success mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">
                  Start your routine today and track progress with weekly scans
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-success hover:bg-success/90 text-white">
                    <Calendar className="mr-2 h-5 w-5" />
                    Set Routine Reminders
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => navigate("/scan")}
                  >
                    Take New Scan in 7 Days
                  </Button>
                </div>
              </Card>

              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => toast.success("Shopping list sent to email!")}>
                  <Mail className="mr-2 h-4 w-4" />
                  Email Shopping List
                </Button>
                <Button variant="outline" onClick={() => toast.success("PDF download coming soon!")}>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Customization */}
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold mb-4">Customize Routine</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Routine Length</label>
                  <Select value={routineLength} onValueChange={setRoutineLength}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quick">Quick (5 min)</SelectItem>
                      <SelectItem value="standard">Standard (10 min)</SelectItem>
                      <SelectItem value="complete">Complete (15 min)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Budget Preference</label>
                  <Select value={budget} onValueChange={setBudget}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="$">$ (Under $15)</SelectItem>
                      <SelectItem value="$$">$$ ($15-30)</SelectItem>
                      <SelectItem value="$$$">$$$ (Over $30)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Exclude Ingredients</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="fragrance" />
                      <label htmlFor="fragrance" className="text-sm cursor-pointer">
                        Fragrance
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="essential-oils" />
                      <label htmlFor="essential-oils" className="text-sm cursor-pointer">
                        Essential Oils
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="alcohol" />
                      <label htmlFor="alcohol" className="text-sm cursor-pointer">
                        Drying Alcohols
                      </label>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => toast.success("Routine updated!")}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Update Routine
                </Button>
              </div>
            </Card>

            {/* Progress Tracker */}
            <ProgressTracker />

            {/* Shopping List */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Shopping List</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Save and track products you need
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <Checkbox id="item1" />
                  <label htmlFor="item1" className="text-sm cursor-pointer">
                    CeraVe Cleanser ($14)
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="item2" />
                  <label htmlFor="item2" className="text-sm cursor-pointer">
                    Vitamin C Serum ($25)
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="item3" />
                  <label htmlFor="item3" className="text-sm cursor-pointer">
                    Sunscreen SPF 50 ($18)
                  </label>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between text-sm font-medium mb-3">
                  <span>Total:</span>
                  <span>$57</span>
                </div>
                <Button className="w-full" size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export List
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                We may earn commission on purchases
              </p>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Routine;
