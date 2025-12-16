import SEOHead from "@/components/seo/SEOHead";
import { Link } from "react-router-dom";
import { TreePine, Shield, Zap, Heart } from "lucide-react";

const About = () => {
  return (
    <>
      <SEOHead
        title="About Us - Pine Tools Hub | Free Online PDF & Image Tools"
        description="Learn about Pine Tools Hub - your trusted source for free online PDF and image tools. We provide secure, browser-based document processing with no registration required."
        keywords="about pine tools hub, free pdf tools, online document tools, about us, pdf converter company, image tools provider"
        canonical="https://pinetoolshub.com/about"
      />

      <div className="py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <TreePine className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">About Pine Tools Hub</h1>
            <p className="text-xl text-muted-foreground">
              Your trusted destination for free, secure, and easy-to-use PDF and image tools
            </p>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2>Our Mission</h2>
            <p>
              At Pine Tools Hub, we believe everyone should have access to professional-quality document and image tools without the complexity, cost, or privacy concerns of traditional software. Our mission is to provide free, browser-based tools that anyone can use, anywhere, at any time.
            </p>
            <p>
              We created Pine Tools Hub to solve a simple problem: people need to work with PDFs and images every day, but most solutions are either expensive, complicated, or require uploading sensitive files to unknown servers. We knew there had to be a better way.
            </p>

            <h2>What Makes Us Different</h2>
            
            <div className="grid md:grid-cols-2 gap-6 not-prose my-8">
              <div className="p-6 bg-muted rounded-lg">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Privacy First</h3>
                <p className="text-muted-foreground">
                  All our tools process files directly in your browser. Your documents never leave your device, ensuring complete privacy and security for sensitive files.
                </p>
              </div>
              <div className="p-6 bg-muted rounded-lg">
                <Zap className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Fast & Free</h3>
                <p className="text-muted-foreground">
                  No registration, no subscriptions, no hidden costs. Our tools are 100% free to use with no limits on how many files you can process.
                </p>
              </div>
              <div className="p-6 bg-muted rounded-lg">
                <TreePine className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Eco-Friendly</h3>
                <p className="text-muted-foreground">
                  By processing files locally, we reduce server energy consumption. It's a small step toward more sustainable technology.
                </p>
              </div>
              <div className="p-6 bg-muted rounded-lg">
                <Heart className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">User-Focused</h3>
                <p className="text-muted-foreground">
                  We design every tool with simplicity in mind. No confusing interfaces, no unnecessary steps - just efficient tools that work.
                </p>
              </div>
            </div>

            <h2>Our Tools</h2>
            <p>
              Pine Tools Hub offers a comprehensive suite of PDF and image tools designed for everyday tasks:
            </p>
            <ul>
              <li><strong>PDF Tools:</strong> Merge, split, compress, convert, rotate, watermark, protect, unlock, and organize PDFs</li>
              <li><strong>Image Tools:</strong> Compress images, remove backgrounds, and convert between formats</li>
              <li><strong>Conversion Tools:</strong> Convert between PDF, Word, JPG, PNG, and more</li>
            </ul>
            <p>
              Every tool is built with the same commitment to privacy, speed, and ease of use. We're constantly adding new features based on user feedback and evolving needs.
            </p>

            <h2>Our Technology</h2>
            <p>
              Pine Tools Hub leverages modern web technologies to deliver powerful processing capabilities directly in your browser. We use advanced JavaScript libraries for PDF manipulation, image processing, and format conversion - all without requiring server-side processing.
            </p>
            <p>
              This approach offers several advantages:
            </p>
            <ul>
              <li>Instant processing without waiting for server queues</li>
              <li>Complete file privacy - nothing leaves your device</li>
              <li>No file size restrictions imposed by server limitations</li>
              <li>Works offline once the page is loaded</li>
            </ul>

            <h2>Our Commitment</h2>
            <p>
              We're committed to keeping Pine Tools Hub free and accessible for everyone. While we display non-intrusive ads to support our operations, we will never:
            </p>
            <ul>
              <li>Collect or store your personal files</li>
              <li>Sell your data to third parties</li>
              <li>Lock essential features behind paywalls</li>
              <li>Compromise on security or privacy</li>
            </ul>

            <h2>Get in Touch</h2>
            <p>
              We love hearing from our users! Whether you have feedback, suggestions, or questions, we're here to help. Visit our{" "}
              <Link to="/contact" className="text-primary hover:underline">
                Contact page
              </Link>{" "}
              to reach out, or explore our tools and experience the Pine Tools Hub difference for yourself.
            </p>
            <p>
              Thank you for choosing Pine Tools Hub. We're honored to be part of your document workflow.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
