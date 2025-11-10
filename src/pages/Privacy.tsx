import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, ArrowLeft } from "lucide-react";

const Privacy = () => {
  const navigate = useNavigate();
  const lastUpdated = "November 9, 2025";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </div>

        <Card className="p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to SkinScan ("we," "our," or "us"). We are committed to
              protecting your personal information and your right to privacy. This
              Privacy Policy explains how we collect, use, disclose, and safeguard
              your information when you use our skin analysis application and
              services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Information We Collect
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  1. Personal Information
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Email address (required for account creation)</li>
                  <li>Name (optional)</li>
                  <li>Payment information (processed securely by Stripe)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  2. Skin Analysis Data
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Photos of your skin (stored securely and encrypted)</li>
                  <li>Skin health metrics and analysis results</li>
                  <li>Onboarding preferences (skin concerns, routine, budget)</li>
                  <li>Progress tracking data and scan history</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">
                  3. Automatically Collected Information
                </h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Device information (browser type, operating system)</li>
                  <li>Usage data (pages visited, features used)</li>
                  <li>IP address and general location</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>To provide and maintain our skin analysis services</li>
              <li>To process your photos using AI analysis</li>
              <li>To personalize your experience and recommendations</li>
              <li>To track your progress over time</li>
              <li>To process payments and manage subscriptions</li>
              <li>To send service-related notifications and updates</li>
              <li>To improve our services and develop new features</li>
              <li>To detect and prevent fraud or abuse</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Storage and Security</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>End-to-end encryption for all data transmission</li>
                <li>Secure cloud storage with Supabase (SOC 2 Type II certified)</li>
                <li>Row-level security (RLS) policies on all database tables</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication requirements</li>
              </ul>
              <p className="mt-3">
                <strong>Data Retention:</strong> We retain your data for as long as
                your account is active or as needed to provide services. You can
                request deletion at any time.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Sharing Your Information</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>We do NOT sell your personal information. We may share data with:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong>Service Providers:</strong> Supabase (database), Stripe
                  (payments), AI processing services
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law,
                  subpoena, or legal process
                </li>
                <li>
                  <strong>Business Transfers:</strong> In case of merger,
                  acquisition, or sale of assets
                </li>
                <li>
                  <strong>With Your Consent:</strong> When you explicitly authorize
                  us to share your information
                </li>
              </ul>
              <p className="mt-3 font-semibold text-foreground">
                We NEVER share your skin photos with third parties for marketing or
                advertising purposes.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Privacy Rights</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Depending on your location, you have the following rights:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <strong>Access:</strong> Request a copy of your personal data
                </li>
                <li>
                  <strong>Correction:</strong> Update or correct inaccurate
                  information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your account and
                  data
                </li>
                <li>
                  <strong>Portability:</strong> Receive your data in a structured
                  format
                </li>
                <li>
                  <strong>Objection:</strong> Object to certain processing activities
                </li>
                <li>
                  <strong>Withdraw Consent:</strong> Withdraw consent at any time
                </li>
              </ul>
              <p className="mt-3">
                To exercise these rights, contact us at{" "}
                <a
                  href="mailto:privacy@skinscan.app"
                  className="text-primary hover:underline"
                >
                  privacy@skinscan.app
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>We use cookies and similar technologies for:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Essential functionality (authentication, session management)</li>
                <li>Analytics (understanding how you use our service)</li>
                <li>Preferences (remembering your settings)</li>
              </ul>
              <p className="mt-3">
                You can control cookies through your browser settings. Disabling
                essential cookies may affect functionality.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Children's Privacy (COPPA/GDPR-K)
            </h2>
            <p className="text-muted-foreground">
              Our service is not intended for users under 13 years old (or 16 in the
              EU). We do not knowingly collect personal information from children. If
              you believe a child has provided us with personal information, please
              contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              International Data Transfers
            </h2>
            <p className="text-muted-foreground">
              Your information may be transferred to and processed in countries
              outside your residence. We ensure appropriate safeguards are in place
              through standard contractual clauses and compliance frameworks
              (EU-U.S. Data Privacy Framework).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              California Privacy Rights (CCPA)
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                If you are a California resident, you have additional rights under
                the California Consumer Privacy Act (CCPA):
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Right to know what personal information we collect and how we use it</li>
                <li>Right to delete your personal information</li>
                <li>Right to opt-out of the "sale" of personal information (we don't sell data)</li>
                <li>Right to non-discrimination for exercising your rights</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you
              of significant changes via email or through the app. Continued use after
              changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <div className="text-muted-foreground space-y-2">
              <p>
                If you have questions about this Privacy Policy or our practices:
              </p>
              <div className="bg-muted/50 rounded-lg p-4 mt-3">
                <p>
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:privacy@skinscan.app"
                    className="text-primary hover:underline"
                  >
                    privacy@skinscan.app
                  </a>
                </p>
                <p>
                  <strong>Support:</strong>{" "}
                  <a
                    href="mailto:support@skinscan.app"
                    className="text-primary hover:underline"
                  >
                    support@skinscan.app
                  </a>
                </p>
              </div>
            </div>
          </section>

          <section className="bg-primary/5 border-l-4 border-primary p-4 rounded">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">
                Important Medical Disclaimer:
              </strong>{" "}
              SkinScan is not a medical device and does not provide medical advice.
              Our AI analysis is for informational and educational purposes only.
              Always consult a board-certified dermatologist for medical concerns.
            </p>
          </section>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-8 bg-muted/50">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SkinScan. All rights reserved.</p>
          <div className="flex items-center justify-center gap-6 mt-4">
            <a
              onClick={() => navigate("/privacy")}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Privacy
            </a>
            <a
              onClick={() => navigate("/terms")}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Terms
            </a>
            <a
              onClick={() => navigate("/contact")}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
