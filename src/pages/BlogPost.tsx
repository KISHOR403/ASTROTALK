import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Calendar, Clock, ArrowLeft, Tag, BookOpen, Share2, ArrowRight } from 'lucide-react';
import { getBlogPost, blogPosts } from '@/lib/blog-data';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = getBlogPost(slug || '');

  if (!post) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <div className="text-6xl">🔭</div>
          <h1 className="font-display text-3xl font-bold text-foreground">Article Not Found</h1>
          <p className="text-muted-foreground">The cosmic scroll you seek has not been written yet.</p>
          <Link to="/blog" className="mt-4 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
            Back to Blog
          </Link>
        </div>
      </Layout>
    );
  }

  // Related posts: same category, excluding current
  const related = blogPosts
    .filter(p => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  const allOthers = blogPosts.filter(p => p.slug !== post.slug);
  const suggestions = related.length > 0 ? related : allOthers.slice(0, 3);

  return (
    <Layout>
      <article className="py-20">
        <div className="container mx-auto px-4">

          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => navigate('/blog')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </button>
          </motion.div>

          <div className="max-w-3xl mx-auto">

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold border border-primary/20">
                  {post.category}
                </span>
                {post.featured && (
                  <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold">
                    Featured
                  </span>
                )}
              </div>

              <div className="text-7xl mb-6">{post.image}</div>

              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-foreground">
                {post.title}
              </h1>

              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {post.excerpt}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 pb-8 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {post.author.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{post.author}</p>
                    <p className="text-xs text-muted-foreground">{post.authorRole}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground ml-auto">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />{post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />{post.readTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />Article
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose-vedic space-y-6 mb-12"
            >
              {post.content.map((section, idx) => {
                if (section.type === 'paragraph') {
                  return (
                    <p key={idx} className="text-muted-foreground leading-relaxed text-base md:text-lg">
                      {section.text}
                    </p>
                  );
                }
                if (section.type === 'heading') {
                  return (
                    <h2 key={idx} className="font-display text-xl md:text-2xl font-bold text-foreground pt-4 flex items-center gap-3">
                      <span className="w-1 h-6 rounded-full bg-primary inline-block" />
                      {section.text}
                    </h2>
                  );
                }
                if (section.type === 'list') {
                  return (
                    <ul key={idx} className="space-y-3">
                      {section.items?.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-muted-foreground text-sm md:text-base">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (section.type === 'highlight' || section.type === 'quote') {
                  return (
                    <blockquote key={idx} className="glass-card border-l-4 border-accent px-6 py-5 rounded-r-xl">
                      <p className="text-accent font-medium italic text-sm md:text-base leading-relaxed">
                        {section.text}
                      </p>
                    </blockquote>
                  );
                }
                return null;
              })}
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex flex-wrap items-center gap-2 pb-8 border-b border-border mb-10"
            >
              <Tag className="w-4 h-4 text-muted-foreground" />
              {post.tags.map(tag => (
                <Link
                  key={tag}
                  to={`/blog?search=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs hover:bg-primary/20 hover:text-primary transition-colors"
                >
                  {tag}
                </Link>
              ))}
              <button
                className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: post.title, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card p-8 text-center mb-16"
            >
              <div className="text-4xl mb-3">🌠</div>
              <h3 className="font-display text-xl font-bold mb-2 text-foreground">
                Get a Personalized Reading
              </h3>
              <p className="text-muted-foreground text-sm mb-5">
                Ready to apply these insights to your own chart? Consult one of our expert Vedic astrologers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/booking"
                  className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  Book a Consultation
                </Link>
                <Link
                  to="/astrologers"
                  className="px-6 py-3 rounded-lg border border-border text-muted-foreground font-semibold text-sm hover:bg-muted transition-colors"
                >
                  Browse Astrologers
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Related Articles */}
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="max-w-5xl mx-auto"
            >
              <h3 className="font-display text-xl font-bold text-foreground mb-6">
                More to Explore
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {suggestions.map(related => (
                  <Link
                    key={related.id}
                    to={`/blog/${related.slug}`}
                    className="group glass-card p-5 flex flex-col transition-all duration-300 hover:border-primary/30 hover:scale-[1.02]"
                  >
                    <div className="text-4xl mb-3">{related.image}</div>
                    <span className="text-xs text-primary font-medium mb-2">{related.category}</span>
                    <h4 className="font-display text-sm font-semibold mb-2 group-hover:text-accent transition-colors leading-snug flex-1">
                      {related.title}
                    </h4>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
                      <span>{related.readTime}</span>
                      <span className="flex items-center gap-1 group-hover:text-accent transition-colors">
                        Read <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
