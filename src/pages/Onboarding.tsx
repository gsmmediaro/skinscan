import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  Target,
  Droplet,
  Heart,
  AlertCircle,
  Sun,
  Moon
} from "lucide-react";

type OnboardingData = {
  skinConcerns: string[];
  currentRoutineMorning: string;
  currentRoutineEvening: string;
  productsUsing: string[];
  influencedByCreators: boolean;
  prefersScientificApproach: boolean;
  budgetPreference: "budget" | "mid-range" | "luxury" | "any";
  ingredientSensitivities: string[];
};

const SKIN_CONCERNS = [
  { id: "acne", label: "Acne & Breakouts", icon: Target },
  { id: "dryness", label: "Dryness", icon: Droplet },
  { id: "oiliness", label: "Oily Skin", icon: Sparkles },
  { id: "redness", label: "Redness & Inflammation", icon: Heart },
  { id: "dark-spots", label: "Dark Spots", icon: AlertCircle },
  { id: "fine-lines", label: "Fine Lines & Wrinkles", icon: Sun },
  { id: "sensitivity", label: "Sensitive Skin", icon: Moon },
  { id: "texture", label: "Uneven Texture", icon: Target },
];

const INGREDIENT_SENSITIVITIES = [
  { id: "fragrance", label: "Fragrance" },
  { id: "essential-oils", label: "Essential Oils" },
  { id: "alcohol", label: "Alcohol" },
  { id: "sulfates", label: "Sulfates" },
  { id: "parabens", label: "Parabens" },
  { id: "retinol", label: "Retinol" },
];

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    skinConcerns: [],
    currentRoutineMorning: "",
    currentRoutineEvening: "",
    productsUsing: [],
    influencedByCreators: false,
    prefersScientificApproach: true,
    budgetPreference: "any",
    ingredientSensitivities: [],
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    // Validation for each step
    if (step === 1 && data.skinConcerns.length === 0) {
      toast.error("Please select at least one skin concern");
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please sign in to continue");
      navigate("/auth");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("user_preferences")
        .upsert({
          user_id: user.id,
          skin_concerns: data.skinConcerns,
          current_routine_morning: data.currentRoutineMorning || null,
          current_routine_evening: data.currentRoutineEvening || null,
          products_using: data.productsUsing,
          influenced_by_creators: data.influencedByCreators,
          prefers_scientific_approach: data.prefersScientificApproach,
          budget_preference: data.budgetPreference,
          ingredient_sensitivities: data.ingredientSensitivities,
          completed_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success("Profile complete! Ready for your first scan", {
        description: "Your preferences will help us personalize your experience",
      });

      navigate("/scan");
    } catch (error: any) {
      console.error("Onboarding error:", error);
      toast.error("Failed to save preferences", {
        description: error.message || "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SkinScan
            </h1>
            <div className="text-sm text-muted-foreground">
              Step {step} of {totalSteps}
            </div>
          </div>
          <Progress value={progress} className="mt-3 h-1.5" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <Card className="w-full max-w-2xl p-8 shadow-xl">
          {/* Step 1: Skin Concerns */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-coral-500 to-coral-600 mx-auto flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold">What are your main skin concerns?</h2>
                <p className="text-muted-foreground text-lg">
                  Select all that apply. We'll personalize your analysis based on this.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {SKIN_CONCERNS.map(({ id, label, icon: Icon }) => {
                  const isSelected = data.skinConcerns.includes(id);
                  return (
                    <button
                      key={id}
                      onClick={() =>
                        setData({
                          ...data,
                          skinConcerns: toggleArrayItem(data.skinConcerns, id),
                        })
                      }
                      className={`
                        p-4 rounded-xl border-2 transition-all duration-200
                        flex items-center gap-3 text-left
                        ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border hover:border-primary/50 hover:bg-primary/5"
                        }
                      `}
                    >
                      <div
                        className={`
                        w-10 h-10 rounded-lg flex items-center justify-center
                        ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted"}
                      `}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium flex-1">{label}</span>
                      {isSelected && (
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Current Routine */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-mint-500 to-mint-600 mx-auto flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold">What's your current routine?</h2>
                <p className="text-muted-foreground text-lg">
                  Help us understand what you're currently using (optional but recommended)
                </p>
              </div>

              <div className="space-y-6 pt-4">
                <div className="space-y-3">
                  <Label htmlFor="morning-routine" className="text-base flex items-center gap-2">
                    <Sun className="w-5 h-5 text-amber-500" />
                    Morning Routine
                  </Label>
                  <Textarea
                    id="morning-routine"
                    placeholder="E.g., Cleanser → Vitamin C serum → Moisturizer → SPF 50"
                    value={data.currentRoutineMorning}
                    onChange={(e) =>
                      setData({ ...data, currentRoutineMorning: e.target.value })
                    }
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="evening-routine" className="text-base flex items-center gap-2">
                    <Moon className="w-5 h-5 text-indigo-500" />
                    Evening Routine
                  </Label>
                  <Textarea
                    id="evening-routine"
                    placeholder="E.g., Oil cleanser → Gentle cleanser → Retinol → Night cream"
                    value={data.currentRoutineEvening}
                    onChange={(e) =>
                      setData({ ...data, currentRoutineEvening: e.target.value })
                    }
                    rows={3}
                    className="resize-none"
                  />
                </div>

                <div className="bg-primary/5 rounded-lg p-4 text-sm text-muted-foreground">
                  💡 <strong>Tip:</strong> Don't worry if you don't have a routine yet!
                  We'll help you build one based on your skin analysis.
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preferences & Trust */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 mx-auto flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold">Let's personalize your experience</h2>
                <p className="text-muted-foreground text-lg">
                  We're not here to sell you hype—just honest, science-backed recommendations
                </p>
              </div>

              <div className="space-y-6 pt-4">
                {/* Trust Question */}
                <Card className="p-5 border-2">
                  <p className="font-medium mb-3">
                    Do you trust skincare advice from influencers?
                  </p>
                  <RadioGroup
                    value={data.influencedByCreators ? "yes" : "no"}
                    onValueChange={(value) =>
                      setData({ ...data, influencedByCreators: value === "yes" })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="trust-no" />
                      <Label htmlFor="trust-no" className="font-normal cursor-pointer">
                        No, I prefer science-backed recommendations
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="trust-yes" />
                      <Label htmlFor="trust-yes" className="font-normal cursor-pointer">
                        Yes, I follow creator recommendations
                      </Label>
                    </div>
                  </RadioGroup>
                </Card>

                {/* Budget Preference */}
                <Card className="p-5 border-2">
                  <p className="font-medium mb-3">What's your budget for skincare?</p>
                  <RadioGroup
                    value={data.budgetPreference}
                    onValueChange={(value: any) =>
                      setData({ ...data, budgetPreference: value })
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="budget" id="budget-low" />
                      <Label htmlFor="budget-low" className="font-normal cursor-pointer">
                        Budget-friendly ($ - under $20)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mid-range" id="budget-mid" />
                      <Label htmlFor="budget-mid" className="font-normal cursor-pointer">
                        Mid-range ($$ - $20-50)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="luxury" id="budget-high" />
                      <Label htmlFor="budget-high" className="font-normal cursor-pointer">
                        Luxury ($$$ - $50+)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="any" id="budget-any" />
                      <Label htmlFor="budget-any" className="font-normal cursor-pointer">
                        Any price - show me what works
                      </Label>
                    </div>
                  </RadioGroup>
                </Card>

                {/* Ingredient Sensitivities */}
                <Card className="p-5 border-2">
                  <p className="font-medium mb-3">
                    Any ingredients you want to avoid?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {INGREDIENT_SENSITIVITIES.map(({ id, label }) => (
                      <div key={id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`sensitivity-${id}`}
                          checked={data.ingredientSensitivities.includes(id)}
                          onCheckedChange={(checked) =>
                            setData({
                              ...data,
                              ingredientSensitivities: checked
                                ? [...data.ingredientSensitivities, id]
                                : data.ingredientSensitivities.filter((i) => i !== id),
                            })
                          }
                        />
                        <Label
                          htmlFor={`sensitivity-${id}`}
                          className="font-normal cursor-pointer text-sm"
                        >
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-sm">
                  <strong className="text-success">🎯 Our Promise:</strong> We'll only recommend
                  products with proven ingredients that match your budget and concerns.
                  No influencer BS.
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1 || loading}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={loading}
              className="gap-2 bg-gradient-to-r from-primary to-secondary"
              size="lg"
            >
              {loading ? (
                "Saving..."
              ) : step === totalSteps ? (
                <>
                  Get My Glow Score
                  <Sparkles className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>

          {/* Skip Option */}
          {step < totalSteps && (
            <div className="text-center mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/scan")}
                className="text-muted-foreground"
              >
                Skip for now
              </Button>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Onboarding;
