import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Calendar, Clock, ArrowRight, Search, Tag, TrendingUp } from 'lucide-react';
import { blogPosts, categories } from '@/lib/blog-data';

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
      const matchesSearch =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const featuredPosts = filtered.filter(p => p.featured);
  const regularPosts = filtered.filter(p => !p.featured);
  const hasActiveFilters = activeCategory !== 'All' || searchQuery.trim() !== '';

  return (
    <Layout>
      <section className="py-20 md:py-24 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[72rem] h-[72rem] rounded-full bg-gradient-to-b from-primary/12 via-accent/10 to-transparent blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.06),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.05),transparent_45%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.05),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.04),transparent_45%)]" />
        </div>

        <div className="container mx-auto px-4 relative">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
              <TrendingUp className="w-4 h-4" />
              {blogPosts.length} Articles & Guides
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
              <span className="text-foreground">Cosmic </span>
              <span className="text-gradient-gold">Knowledge</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore the depths of Vedic astrology through our curated articles,
              guides, and insights from expert practitioners.
            </p>
          </motion.div>

          {/* Search + quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="max-w-3xl mx-auto mb-10"
          >
            <div className="glass-card p-4 sm:p-5">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search articles, topics, tags..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-background/40 border border-border/70 focus:border-primary/60 focus:ring-2 focus:ring-primary/15 outline-none text-foreground placeholder:text-muted-foreground transition-all"
                />
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/70" />
                  Showing <span className="text-foreground font-semibold">{filtered.length}</span> of {blogPosts.length}
                </span>
                {activeCategory !== 'All' && (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/70" />
                    Category: <span className="text-foreground font-semibold">{activeCategory}</span>
                  </span>
                )}
                {hasActiveFilters && (
                  <button
                    onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                    className="ml-auto text-primary hover:text-primary/80 transition-colors font-semibold"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 flex-wrap justify-center mb-12"
          >
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 border-primary/40'
                    : 'bg-background/40 text-muted-foreground hover:bg-muted/40 hover:text-foreground border-border/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* No results */}
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="max-w-lg mx-auto glass-card p-10">
                <div className="text-5xl mb-4">🔭</div>
                <p className="text-foreground font-semibold text-lg mb-2">No articles found.</p>
                <p className="text-muted-foreground text-sm">
                  Try a different keyword or browse another category.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                  className="mt-6 inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Reset search
                </button>
              </div>
            </motion.div>
          )}

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <h2 className="font-display text-lg font-semibold text-muted-foreground mb-4 uppercase tracking-widest text-xs">
                ✦ Featured Articles
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mb-12">
                {featuredPosts.map(post => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group glass-card p-7 sm:p-8 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5"
                  >
                    <div className="flex items-start gap-6">
                      <div className="text-6xl shrink-0 leading-none">{post.image}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-semibold">
                            Featured
                          </span>
                          <span className="text-xs text-muted-foreground">{post.category}</span>
                        </div>
                        <h2 className="font-display text-xl font-semibold mb-2 group-hover:text-accent transition-colors leading-snug">
                          {post.title}
                        </h2>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />{post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />{post.readTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Regular Posts */}
          {regularPosts.length > 0 && (
            <>
              {featuredPosts.length > 0 && (
                <h2 className="font-display text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-widest">
                  ✦ All Articles
                </h2>
              )}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.07 }}
                  >
                    <Link
                      to={`/blog/${post.slug}`}
                      className="group glass-card p-6 h-full flex flex-col transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
                    >
                      <div className="text-5xl mb-4 leading-none">{post.image}</div>
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="w-3 h-3 text-primary" />
                        <span className="text-xs text-primary font-medium">{post.category}</span>
                      </div>
                      <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-accent transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-3">
                        {post.excerpt}
                      </p>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 2).map(tag => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded-full bg-muted/70 text-muted-foreground border border-border/60"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />{post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />{post.readTime}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 group-hover:text-accent transition-colors font-semibold">
                          Read <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* Newsletter CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-20 glass-card p-8 sm:p-10 text-center max-w-2xl mx-auto"
          >
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="font-display text-2xl font-bold mb-3">
              Weekly <span className="text-gradient-gold">Cosmic Insights</span>
            </h3>
            <p className="text-muted-foreground mb-6">
              Get weekly Vedic astrology insights, planetary transits, and personalized guidance delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 rounded-lg bg-background/40 border border-border/70 focus:border-primary/60 focus:ring-2 focus:ring-primary/15 outline-none text-sm text-foreground placeholder:text-muted-foreground transition-all"
              />
              <button className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </motion.div>

        </div>
      </section>
    </Layout>
  );
};

export default BlogPage;
