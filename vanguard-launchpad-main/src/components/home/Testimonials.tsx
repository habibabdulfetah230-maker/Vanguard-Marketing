import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchTestimonials } from "@/lib/api";
import MediaAwareImage from "@/components/ui/MediaAwareImage";

export const Testimonials = () => {
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchTestimonials,
  });
  return (
    <section className="py-24 bg-background">
      <div className="container-wide">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="section-heading mt-3 text-foreground">
            What Our <span className="text-gradient">Clients Say</span>
          </h2>
          <p className="section-subheading mt-4 mx-auto">
            Don't just take our word for it. Here's what business leaders say
            about working with us.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : testimonials && testimonials.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="card-premium p-8 relative"
              >
                {/* Quote Icon */}
                <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />

                {/* Rating - Default to 5 stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-muted-foreground leading-relaxed mb-6">
                  "{testimonial.testimonial}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <MediaAwareImage
                    src={testimonial.photoUrl}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                    fallback={
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                        <span className="text-slate-400 text-lg font-semibold">
                          {testimonial.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    }
                  />
                  <div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No testimonials available yet.</p>
            <p className="text-sm mt-2">Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </section>
  );
};
