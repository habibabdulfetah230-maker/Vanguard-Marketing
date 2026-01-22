import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Video,
  Users,
  Target,
  Camera,
  Palette,
  Star,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Video,
    title: "Content Creation",
    description:
      "High-quality video and photo content that captures attention and drives engagement.",
  },
  {
    icon: Users,
    title: "Social Media Management",
    description:
      "Strategic daily posting, community management, and page optimization.",
  },
  {
    icon: Target,
    title: "Paid Advertising",
    description:
      "ROI-focused Facebook & Instagram ads that generate leads and sales.",
  },
  {
    icon: Camera,
    title: "Photography & Videography",
    description:
      "Professional shoots that elevate your brand's visual presence.",
  },
  {
    icon: Palette,
    title: "Branding & Design",
    description:
      "Complete brand identity systems, templates, and marketing materials.",
  },
  {
    icon: Star,
    title: "Reputation Management",
    description:
      "Build trust through strategic review management and engagement.",
  },
];

export const ServicesPreview = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-navy">
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
            Our Services
          </span>
          <h2 className="section-heading mt-3 text-foreground">
            Everything You Need to{" "}
            <span className="text-gradient">Dominate Digital</span>
          </h2>
          <p className="section-subheading mt-4 mx-auto">
            Comprehensive marketing solutions designed to accelerate your
            business growth.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group card-premium p-8 hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link to="/services">
            <Button variant="heroOutline" size="lg" className="group">
              View Full Services
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
