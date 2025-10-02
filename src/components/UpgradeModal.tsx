import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Crown, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  loading?: boolean;
  title?: string;
  description?: string;
  ctaText?: string;
}

export const UpgradeModal = ({
  open,
  onClose,
  onUpgrade,
  loading = false,
  title = "Unlock Your Full Potential",
  description = "Get unlimited scans, detailed analysis, and personalized recommendations",
  ctaText = "Upgrade to Premium",
}: UpgradeModalProps) => {
  const freeFeatures = [
    "1 scan every 7 days",
    "Basic Glow Score",
    "Morning routine only",
    "Limited insights",
  ];

  const premiumFeatures = [
    "Unlimited scans",
    "Full detailed analysis",
    "Morning & evening routines",
    "AI-powered heatmap",
    "Product recommendations",
    "Progress tracking",
    "Weekly insights report",
    "Priority support",
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display flex items-center gap-2">
            <Crown className="w-6 h-6 text-accent" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-base">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 my-6">
          {/* Free Plan */}
          <div className="border rounded-lg p-5 space-y-4">
            <div>
              <h3 className="font-bold text-lg mb-1">Free</h3>
              <p className="text-2xl font-display font-bold">$0<span className="text-sm font-normal text-muted-foreground">/month</span></p>
            </div>
            <ul className="space-y-2.5">
              {freeFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Premium Plan */}
          <div className="border-2 border-accent rounded-lg p-5 space-y-4 relative overflow-hidden bg-gradient-to-br from-accent/5 to-transparent">
            <div className="absolute -top-2 -right-2 w-20 h-20 bg-accent/20 rounded-full blur-2xl" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg">Premium</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-semibold">
                  Most Popular
                </span>
              </div>
              <p className="text-2xl font-display font-bold">$9.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
            </div>
            <ul className="space-y-2.5">
              {premiumFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span className="font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Testimonial */}
        <div className="bg-muted rounded-lg p-4 border-l-4 border-success">
          <p className="text-sm italic text-muted-foreground mb-2">
            "Premium transformed my skincare journey. The detailed analysis helped me target my specific concerns and I saw results in just 2 weeks!"
          </p>
          <p className="text-sm font-semibold">- Sarah M., Glow Score 92</p>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Button
            onClick={onUpgrade}
            disabled={loading}
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground shadow-premium"
            size="lg"
          >
            {loading ? (
              "Processing..."
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                {ctaText}
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            size="lg"
          >
            Maybe Later
          </Button>
        </div>

        {/* Money-back guarantee */}
        <p className="text-center text-xs text-muted-foreground">
          🛡️ 30-day money-back guarantee • Cancel anytime
        </p>
      </DialogContent>
    </Dialog>
  );
};