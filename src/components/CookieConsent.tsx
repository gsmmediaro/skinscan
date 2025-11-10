import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cookie, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const COOKIE_CONSENT_KEY = "skinscan-cookie-consent";

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Show banner after 2 seconds
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify({
        accepted: true,
        timestamp: new Date().toISOString(),
      })
    );
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(
      COOKIE_CONSENT_KEY,
      JSON.stringify({
        accepted: false,
        timestamp: new Date().toISOString(),
      })
    );
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <Card className="max-w-4xl mx-auto p-6 shadow-2xl border-2 bg-background/95 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Cookie className="w-6 h-6 text-primary" />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2">We value your privacy</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We use cookies to enhance your browsing experience, analyze site traffic,
              and personalize content. By clicking "Accept All", you consent to our use
              of cookies.{" "}
              <button
                onClick={() => navigate("/privacy")}
                className="text-primary hover:underline"
              >
                Read our Privacy Policy
              </button>
            </p>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleAccept} size="sm" className="gap-2">
                Accept All
              </Button>
              <Button
                onClick={handleDecline}
                variant="outline"
                size="sm"
              >
                Decline
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/privacy")}
              >
                Learn More
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-3">
              Essential cookies are always enabled to ensure the site functions
              properly.
            </p>
          </div>

          <button
            onClick={handleDecline}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close cookie banner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </Card>
    </div>
  );
};
