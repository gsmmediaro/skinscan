import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Mail, Twitter, Copy, Sparkles } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { inviteEmailsSchema } from "@/lib/validation";
import { supabase } from "@/integrations/supabase/client";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  onUnlock: () => void;
  glowScore: number;
}

export const ShareModal = ({ open, onClose, onUnlock, glowScore }: ShareModalProps) => {
  const navigate = useNavigate();
  const [emails, setEmails] = useState("");
  const [loading, setLoading] = useState(false);

  const shareText = `I just got a ${glowScore} Glow Score on SkinScan! 🌟 Check out your skin health too!`;
  const shareUrl = window.location.origin;

  const handleShare = async (platform: string) => {
    setLoading(true);
    
    // Simulate share action
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (platform === "copy") {
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      toast.success("Link copied to clipboard!");
    } else {
      toast.success(`Shared to ${platform}!`);
    }

    triggerUnlock();
  };

  const handleInvite = async () => {
    try {
      // Validate emails
      const validation = inviteEmailsSchema.safeParse(emails);
      if (!validation.success) {
        toast.error(validation.error.errors[0].message);
        return;
      }

      const emailList = validation.data;
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to send invites");
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", user.id)
        .single();

      const inviterName = profile?.email?.split("@")[0] || "A friend";

      const { error } = await supabase.functions.invoke("send-invite", {
        body: {
          emails: emailList,
          inviterName,
        },
      });

      if (error) throw error;

      toast.success(`Invitations sent to ${emailList.length} friends!`);
      triggerUnlock();
    } catch (error: any) {
      console.error("Error sending invites:", error);
      toast.error("Failed to send invites. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const triggerUnlock = () => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF6B9D', '#6B5CE7', '#4ADE80'],
    });

    setTimeout(() => {
      onUnlock();
      onClose();
      toast.success("Full report unlocked! 🎉", {
        description: "You now have access to your complete skin analysis.",
      });
    }, 500);
  };

  const handlePremiumUpgrade = async () => {
    try {
      setLoading(true);

      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please sign in to upgrade", {
          description: "You need to be signed in to access premium features"
        });
        onClose();
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
        onClose();
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: any) {
      console.error("Premium upgrade error:", error);
      toast.error("Failed to start checkout", {
        description: error.message || "Please try again later"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-glow bg-clip-text text-transparent">
            Unlock Your Full Report
          </DialogTitle>
          <DialogDescription>
            Share your Glow Score to see your complete skin analysis with personalized recommendations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Share Options */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Quick Share</p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => handleShare("twitter")}
                disabled={loading}
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => handleShare("copy")}
                disabled={loading}
              >
                <Copy className="w-4 h-4" />
                Copy Link
              </Button>
            </div>
          </div>

          {/* Invite Friends */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Invite 3 Friends</p>
            <div className="flex gap-2">
              <Input
                placeholder="friend1@email.com, friend2@email.com, ..."
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                disabled={loading}
              />
              <Button
                onClick={handleInvite}
                disabled={loading}
                className="bg-gradient-glow"
              >
                <Mail className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Separate multiple emails with commas
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Premium Option */}
          <Button
            onClick={handlePremiumUpgrade}
            disabled={loading}
            className="w-full bg-secondary hover:bg-secondary/90 gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Skip with Premium - $9.99/month
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
