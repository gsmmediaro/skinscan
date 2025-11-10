import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, ArrowLeft } from "lucide-react";

const Terms = () => {
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
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>

        <Card className="p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using SkinScan ("Service", "we", "us", or "our"), you
              agree to be bound by these Terms of Service ("Terms"). If you disagree
              with any part of these terms, you may not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Description of Service</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                SkinScan is an AI-powered skin analysis application that provides:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Automated skin health analysis using artificial intelligence</li>
                <li>Personalized skincare recommendations</li>
                <li>Progress tracking over time</li>
                <li>Educational content about skin health</li>
              </ul>
              <p className="mt-3 font-semibold text-foreground">
                IMPORTANT: SkinScan is NOT a medical device and does not provide
                medical diagnosis, treatment, or professional medical advice.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Eligibility</h2>
            <div className="space-y-2 text-muted-foreground">
              <p>You must meet the following requirements to use our Service:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Be at least 13 years old (16 in the EU)</li>
                <li>Have the legal capacity to enter into binding contracts</li>
                <li>Provide accurate and truthful information</li>
                <li>Not be barred from using the Service under applicable law</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
            <div className="space-y-3 text-muted-foreground">
              <h3 className="font-semibold text-foreground">Account Creation</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>You must provide accurate, current information</li>
                <li>You are responsible for maintaining account security</li>
                <li>You must not share your account credentials</li>
                <li>You must notify us immediately of any unauthorized access</li>
              </ul>

              <h3 className="font-semibold text-foreground mt-4">
                Account Termination
              </h3>
              <p>
                We reserve the right to suspend or terminate your account if you
                violate these Terms, engage in fraudulent activity, or for any other
                reason at our discretion.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Subscription and Payments</h2>
            <div className="space-y-3 text-muted-foreground">
              <h3 className="font-semibold text-foreground">Free Tier</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Limited scans (7-day cooldown between free scans)</li>
                <li>Basic analysis results</li>
                <li>Subject to availability and may change</li>
              </ul>

              <h3 className="font-semibold text-foreground mt-4">Premium Tier</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Unlimited scans</li>
                <li>Advanced AI analysis and heat maps</li>
                <li>Personalized product recommendations</li>
                <li>Priority support</li>
                <li>Billed monthly at $9.99/month</li>
              </ul>

              <h3 className="font-semibold text-foreground mt-4">Billing</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Subscriptions renew automatically each billing cycle</li>
                <li>You will be charged on the renewal date</li>
                <li>All payments are processed securely through Stripe</li>
                <li>Prices are subject to change with 30 days notice</li>
              </ul>

              <h3 className="font-semibold text-foreground mt-4">
                Cancellation & Refunds
              </h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>You may cancel your subscription at any time</li>
                <li>Cancellation takes effect at the end of the billing period</li>
                <li>30-day money-back guarantee for first-time subscribers</li>
                <li>No refunds for partial months or unused scans</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">User Content and Photos</h2>
            <div className="space-y-3 text-muted-foreground">
              <h3 className="font-semibold text-foreground">Your Photos</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>You retain ownership of all photos you upload</li>
                <li>
                  You grant us a license to process and analyze your photos for
                  providing the Service
                </li>
                <li>We will NOT use your photos for marketing without permission</li>
                <li>You can delete your photos at any time</li>
              </ul>

              <h3 className="font-semibold text-foreground mt-4">Prohibited Content</h3>
              <p>You may not upload photos that:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Violate any laws or regulations</li>
                <li>Contain explicit or inappropriate content</li>
                <li>Infringe on others' intellectual property rights</li>
                <li>Are not photos of skin (we reserve the right to remove such content)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Medical Disclaimer</h2>
            <div className="bg-warning/10 border-l-4 border-warning p-4 rounded space-y-2 text-muted-foreground">
              <p className="font-semibold text-foreground">
                ⚠️ IMPORTANT MEDICAL DISCLAIMER
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>SkinScan is for informational purposes only</li>
                <li>Our AI analysis is NOT a substitute for professional medical advice</li>
                <li>We do NOT diagnose, treat, or cure any medical conditions</li>
                <li>Always consult a board-certified dermatologist for medical concerns</li>
                <li>Our recommendations are educational, not medical prescriptions</li>
                <li>
                  In case of skin emergency (severe burns, infections, sudden changes),
                  seek immediate medical attention
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Intellectual Property Rights
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p>
                All content, features, and functionality of SkinScan, including but not
                limited to:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Software code and algorithms</li>
                <li>AI models and analysis methods</li>
                <li>Design, text, graphics, and logos</li>
                <li>User interface and user experience</li>
              </ul>
              <p className="mt-3">
                are owned by SkinScan and protected by copyright, trademark, and other
                intellectual property laws. You may not copy, modify, distribute, or
                reverse engineer any part of our Service without written permission.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Acceptable Use Policy</h2>
            <div className="space-y-2 text-muted-foreground">
              <p>You agree NOT to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Use the Service for any illegal purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Use automated tools (bots, scrapers) without permission</li>
                <li>Resell or redistribute our Service</li>
                <li>Reverse engineer our AI models or algorithms</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Upload malicious code or viruses</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <div className="space-y-3 text-muted-foreground">
              <p className="font-semibold text-foreground">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  SkinScan is provided "AS IS" without warranties of any kind, express
                  or implied
                </li>
                <li>
                  We are not liable for any indirect, incidental, special, or
                  consequential damages
                </li>
                <li>
                  Our total liability shall not exceed the amount you paid in the past
                  12 months
                </li>
                <li>
                  We are not responsible for AI analysis errors or inaccuracies
                </li>
                <li>
                  We are not liable for medical consequences of using our recommendations
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify and hold harmless SkinScan, its officers,
              directors, employees, and agents from any claims, damages, losses, or
              expenses (including legal fees) arising from your use of the Service,
              violation of these Terms, or infringement of any third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to Service</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify, suspend, or discontinue any part of the
              Service at any time without notice. We may also change pricing, features,
              or availability with reasonable notice to users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms shall be governed by and construed in accordance with the laws
              of [Your Jurisdiction], without regard to conflict of law provisions. Any
              disputes shall be resolved in the courts of [Your Jurisdiction].
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Dispute Resolution</h2>
            <div className="space-y-3 text-muted-foreground">
              <h3 className="font-semibold text-foreground">Informal Resolution</h3>
              <p>
                Before filing a claim, you agree to contact us at{" "}
                <a
                  href="mailto:support@skinscan.app"
                  className="text-primary hover:underline"
                >
                  support@skinscan.app
                </a>{" "}
                to attempt to resolve the dispute informally.
              </p>

              <h3 className="font-semibold text-foreground mt-4">Arbitration</h3>
              <p>
                If informal resolution fails, disputes will be resolved through binding
                arbitration, except where prohibited by law. You waive your right to a
                jury trial or to participate in class actions.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Severability</h2>
            <p className="text-muted-foreground">
              If any provision of these Terms is found to be unenforceable, the
              remaining provisions will continue in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-muted-foreground">
              <p>
                For questions about these Terms, contact us at:
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:legal@skinscan.app"
                  className="text-primary hover:underline"
                >
                  legal@skinscan.app
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
          </section>

          <section className="bg-primary/5 border-l-4 border-primary p-4 rounded">
            <p className="text-sm text-muted-foreground">
              By using SkinScan, you acknowledge that you have read, understood, and
              agree to be bound by these Terms of Service and our Privacy Policy.
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

export default Terms;
