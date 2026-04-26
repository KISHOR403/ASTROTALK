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

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="glass-card p-8 relative overflow-hidden flex flex-col h-full"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-cosmic flex items-center justify-center text-2xl border-2 border-primary/30 shrink-0">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-display text-lg font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>

              <p className="text-foreground/90 leading-relaxed italic flex-1">
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
