import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Entrepreneur',
    avatar: '👩🏽',
    rating: 5,
    text: 'The birth chart analysis was incredibly accurate. It helped me understand my strengths and the right timing for my business decisions. Truly life-changing!',
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    role: 'Software Engineer',
    avatar: '👨🏾',
    rating: 5,
    text: 'I was skeptical at first, but the compatibility analysis for my relationship was spot-on. The insights helped us understand each other better.',
  },
  {
    id: 3,
    name: 'Anita Desai',
    role: 'Teacher',
    avatar: '👩🏻',
    rating: 5,
    text: 'The daily horoscopes are so personalized and helpful. I start every morning by checking my cosmic guidance. It really sets the tone for my day.',
  },
  {
    id: 4,
    name: 'Vikram Singh',
    role: 'Business Analyst',
    avatar: '👨🏽',
    rating: 5,
    text: 'The consultation with the Vedic astrologer was profound. They provided guidance that helped me navigate a difficult career transition.',
  },
  {
    id: 5,
    name: 'Meera Patel',
    role: 'Healthcare Professional',
    avatar: '👩🏽‍⚕️',
    rating: 5,
    text: 'I love how the platform combines ancient wisdom with modern technology. The interface is beautiful and the readings are deeply insightful.',
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 relative" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            <span className="text-foreground">Voices of the </span>
            <span className="text-gradient-aurora">Cosmos</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Hear from our community of seekers who have discovered their path 
            through Vedic astrology.
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Main Testimonial Card */}
          <div className="glass-card p-8 md:p-12 relative overflow-hidden">
            {/* Quote Icon */}
            <Quote className="absolute top-6 right-6 w-12 h-12 text-primary/20" />

            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Avatar */}
              <div className="shrink-0">
                <div className="w-24 h-24 rounded-full bg-gradient-cosmic flex items-center justify-center text-4xl border-4 border-primary/30">
                  {testimonials[currentIndex].avatar}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                {/* Rating */}
                <div className="flex gap-1 justify-center md:justify-start mb-4">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-lg md:text-xl text-foreground/90 leading-relaxed mb-6 italic">
                  "{testimonials[currentIndex].text}"
                </p>

                {/* Author */}
                <div>
                  <div className="font-display text-lg font-semibold text-foreground">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {testimonials[currentIndex].role}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 bg-accent'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full bg-muted hover:bg-primary/20 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
