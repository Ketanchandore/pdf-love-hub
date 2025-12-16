import { useState } from "react";
import SEOHead from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Send, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });

    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <SEOHead
        title="Contact Us - Pine Tools Hub | Get in Touch"
        description="Contact Pine Tools Hub for support, feedback, or inquiries about our free PDF and image tools. We're here to help with any questions about our online document processing tools."
        keywords="contact pine tools hub, pdf tools support, customer service, feedback, help, support"
        canonical="https://pinetoolshub.com/contact"
      />

      <div className="py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <MessageSquare className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                Whether you have a question about our tools, need help with a specific feature, or want to share feedback, our team is ready to assist you.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email Us</h3>
                    <p className="text-muted-foreground">support@pinetoolshub.com</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      We typically respond within 24-48 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <p className="text-muted-foreground">Operating Worldwide</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Serving users in USA, Australia, and beyond
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-muted rounded-lg">
                <h3 className="font-semibold mb-2">Before You Contact Us</h3>
                <p className="text-sm text-muted-foreground">
                  Many common questions are answered in our tool descriptions and FAQ sections. Check the FAQ on each tool page for quick answers to frequently asked questions.
                </p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>

          <div className="mt-16 prose prose-slate dark:prose-invert max-w-none">
            <h2>Frequently Asked Questions</h2>
            
            <h3>How quickly will I receive a response?</h3>
            <p>
              We strive to respond to all inquiries within 24-48 business hours. For urgent matters, please indicate this in your subject line.
            </p>

            <h3>Can I request new features?</h3>
            <p>
              Absolutely! We love hearing feature requests from our users. Use the contact form above to share your ideas, and our team will review them for future updates.
            </p>

            <h3>I'm having technical issues with a tool. What should I do?</h3>
            <p>
              When reporting technical issues, please include:
            </p>
            <ul>
              <li>Which tool you were using</li>
              <li>Your browser and operating system</li>
              <li>A description of what happened vs. what you expected</li>
              <li>Any error messages you saw</li>
            </ul>
            <p>
              This information helps us diagnose and resolve issues quickly.
            </p>

            <h3>Do you offer business or enterprise solutions?</h3>
            <p>
              Currently, Pine Tools Hub is a free service for individual users. If you're interested in enterprise solutions or custom integrations, please reach out through the contact form to discuss your needs.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
