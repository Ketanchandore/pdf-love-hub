import { Link } from "react-router-dom";
import SEOHead from "@/components/seo/SEOHead";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const blogPosts = [
  {
    slug: "how-to-merge-pdf-files-free",
    title: "How to Merge PDF Files for Free: Complete Guide 2025",
    excerpt: "Learn the easiest ways to combine multiple PDF documents into one file. Step-by-step guide with tips for beginners and professionals.",
    date: "2024-12-17",
    readTime: "5 min read",
    category: "PDF Tips",
  },
  {
    slug: "how-to-compress-pdf-files-free",
    title: "How to Compress PDF Files Free - Ultimate Guide 2025",
    excerpt: "Discover professional techniques to reduce PDF file size while maintaining document quality. Perfect for email attachments and web uploads.",
    date: "2024-12-17",
    readTime: "6 min read",
    category: "PDF Tips",
  },
  {
    slug: "pdf-to-word-converter-guide",
    title: "How to Convert PDF to Word Free - Complete Guide 2025",
    excerpt: "Get the best results when converting PDF documents to editable Word files. Learn how to preserve formatting and handle complex layouts.",
    date: "2024-12-17",
    readTime: "7 min read",
    category: "Tutorials",
  },
  {
    slug: "jpg-to-pdf-converter-guide",
    title: "How to Convert JPG to PDF Free - Complete Guide 2025",
    excerpt: "Learn how to convert JPG images to PDF documents. Create professional PDF files from multiple images in seconds.",
    date: "2024-12-17",
    readTime: "5 min read",
    category: "Tutorials",
  },
  {
    slug: "how-to-split-pdf-files-free",
    title: "How to Split PDF Files Free - Complete Guide 2025",
    excerpt: "Learn how to split PDF files into separate pages or sections. Extract specific pages from large PDF documents easily.",
    date: "2024-12-17",
    readTime: "5 min read",
    category: "PDF Tips",
  },
  {
    slug: "pdf-to-jpg-converter-guide",
    title: "How to Convert PDF to JPG Free - Complete Guide 2025",
    excerpt: "Extract high-quality images from PDF pages. Convert PDF documents to JPG format for easy sharing and editing.",
    date: "2024-12-17",
    readTime: "5 min read",
    category: "Tutorials",
  },
];

const Blog = () => {
  return (
    <>
      <SEOHead
        title="Blog - PDF & Image Tips, Tutorials, and Guides | Pine Tools Hub"
        description="Learn how to work with PDF files and images. Free tutorials, tips, and step-by-step guides for merging PDF, compressing images, converting documents, and more."
        keywords="pdf tips, pdf tutorials, how to merge pdf, compress pdf guide, image optimization, pdf conversion tips, document management, i love pdf guide"
        canonical="https://pinetoolshub.com/blog"
      />

      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: "Blog" }]} />

        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            PDF & Image Tips Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Free tutorials, guides, and tips for working with PDF files and images. 
            Learn from experts and improve your document workflow.
          </p>
        </header>

        {/* Featured Post */}
        <section className="mb-12">
          <article className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl overflow-hidden">
            <div className="p-8 md:p-12">
              <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full mb-4">
                Featured
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <Link to={`/blog/${blogPosts[0].slug}`} className="hover:text-primary transition-colors">
                  {blogPosts[0].title}
                </Link>
              </h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
                {blogPosts[0].excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(blogPosts[0].date).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {blogPosts[0].readTime}
                </span>
              </div>
              <Link 
                to={`/blog/${blogPosts[0].slug}`}
                className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
              >
                Read Full Article <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        </section>

        {/* All Posts Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(1).map((post) => (
              <article 
                key={post.slug} 
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5" />
                <div className="p-6">
                  <span className="inline-block px-2 py-1 bg-muted text-muted-foreground text-xs font-medium rounded mb-3">
                    {post.category}
                  </span>
                  <h3 className="text-xl font-semibold mb-2">
                    <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* SEO Content */}
        <section className="mt-16 prose prose-slate dark:prose-invert max-w-4xl mx-auto">
          <h2>Learn PDF & Image Skills for Free</h2>
          <p>
            Welcome to the Pine Tools Hub Blog - your free resource for learning everything about 
            PDF management and image processing. Our expert guides cover topics from basic tasks 
            like merging PDF files to advanced techniques like optimizing images for web performance.
          </p>
          <p>
            Whether you're a student, professional, or small business owner, our tutorials will 
            help you work more efficiently with documents and images. All guides are written by 
            experienced professionals and updated regularly to reflect the latest best practices.
          </p>
          <h3>Popular Topics</h3>
          <ul>
            <li><strong>PDF Management:</strong> <Link to="/blog/how-to-merge-pdf-files-free">Merge</Link>, <Link to="/blog/how-to-split-pdf-files-free">split</Link>, <Link to="/blog/how-to-compress-pdf-files-free">compress</Link>, and organize PDF files</li>
            <li><strong>Document Conversion:</strong> Convert between <Link to="/blog/pdf-to-word-converter-guide">PDF and Word</Link>, <Link to="/blog/pdf-to-jpg-converter-guide">PDF and JPG</Link>, and more</li>
            <li><strong>Image Optimization:</strong> Compress images for web without losing quality</li>
            <li><strong>Security:</strong> Password protect sensitive documents</li>
          </ul>
        </section>
      </div>
    </>
  );
};

export default Blog;