import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, MessageSquare, ArrowLeft, Send } from "lucide-react";

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending message
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Message sent successfully!", {
      description: "We'll get back to you within 24-48 hours.",
    });

    setFormData({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  };

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
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
          <p className="text-muted-foreground">
            Have questions? We're here to help!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="What's this about?"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more..."
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                />
              </div>

              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Email Support</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    For general inquiries and support
                  </p>
                  <a
                    href="mailto:support@skinscan.app"
                    className="text-primary hover:underline text-sm"
                  >
                    support@skinscan.app
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Privacy & Legal</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Data privacy and legal matters
                  </p>
                  <a
                    href="mailto:privacy@skinscan.app"
                    className="text-primary hover:underline text-sm block mb-1"
                  >
                    privacy@skinscan.app
                  </a>
                  <a
                    href="mailto:legal@skinscan.app"
                    className="text-primary hover:underline text-sm"
                  >
                    legal@skinscan.app
                  </a>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <h3 className="font-semibold mb-3">Response Time</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong className="text-foreground">Support:</strong> 24-48
                    hours
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong className="text-foreground">Premium users:</strong> 12-24
                    hours
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong className="text-foreground">Urgent issues:</strong>{" "}
                    Priority response
                  </span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">FAQs</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Check our frequently asked questions for quick answers:
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <button className="text-primary hover:underline text-left">
                    How accurate is the AI analysis?
                  </button>
                </li>
                <li>
                  <button className="text-primary hover:underline text-left">
                    Can I cancel my subscription anytime?
                  </button>
                </li>
                <li>
                  <button className="text-primary hover:underline text-left">
                    Is my data secure?
                  </button>
                </li>
                <li>
                  <button className="text-primary hover:underline text-left">
                    How do I delete my account?
                  </button>
                </li>
              </ul>
            </Card>
          </div>
        </div>
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

export default Contact;
