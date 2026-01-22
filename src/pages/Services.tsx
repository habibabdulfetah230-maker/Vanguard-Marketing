import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Video,
  Camera,
  Users,
  Target,
  Palette,
  Star,
  ArrowRight,
  Check,
  MessageCircle,
  Image,
  Megaphone,
  Layers,
} from "lucide-react";

const serviceCategories = [
  {
    id: "content",
    icon: Video,
    title: "Content Creation",
    description:
      "High-quality content that captures attention and drives engagement across all platforms.",
    features: [
      "Short-form video content (Reels, TikTok, Shorts)",
      "Professional photo sessions",
      "Story and feed content",
      "UGC-style videos",
      "Product photography",
      "Behind-the-scenes content",
    ],
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&h=400&fit=crop",
  },
  {
    id: "social",
    icon: Users,
    title: "Social Media Management",
    description:
      "Strategic daily management that builds communities and drives consistent growth.",
    features: [
      "Daily posting & scheduling",
      "Content calendar planning",
      "Community management",
      "Page optimization",
      "Engagement strategies",
      "Analytics & reporting",
    ],
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop",
  },
  {
    id: "ads",
    icon: Target,
    title: "Paid Advertising",
    description:
      "ROI-focused campaigns that generate qualified leads and drive real business results.",
    features: [
      "Facebook & Instagram Ads",
      "Lead generation campaigns",
      "Customer acquisition systems",
      "Retargeting strategies",
      "A/B testing & optimization",
      "Performance reporting",
    ],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
  },
  {
    id: "branding",
    icon: Palette,
    title: "Branding & Design",
    description:
      "Complete brand identity systems that position you as a market leader.",
    features: [
      "Brand identity refinement",
      "Logo design & guidelines",
      "Social media templates",
      "Flyers & posters",
      "Digital marketing assets",
      "Presentation design",
    ],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
  },
  {
    id: "reputation",
    icon: Star,
    title: "Reputation Management",
    description:
      "Build trust and credibility through strategic review and reputation systems.",
    features: [
      "Online review management",
      "Engagement replies",
      "Customer trust systems",
      "Crisis management",
      "Brand monitoring",
      "Reputation recovery",
    ],
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&h=400&fit=crop",
  },
];

const pricingTiers = [
  {
    name: "Basic",
    description: "Perfect for small businesses starting their digital journey.",
    features: [
      "Social media management (2 platforms)",
      "8 posts per month",
      "Basic content creation",
      "Monthly reporting",
    ],
  },
  {
    name: "Growth",
    description: "Ideal for businesses ready to scale their digital presence.",
    features: [
      "Social media management (4 platforms)",
      "16 posts per month",
      "Professional content creation",
      "Paid advertising management",
      "Bi-weekly reporting",
      "Community management",
    ],
    popular: true,
  },
  {
    name: "Premium",
    description: "For businesses demanding maximum impact and visibility.",
    features: [
      "Full social media management",
      "Unlimited posts",
      "Premium content & video production",
      "Advanced paid advertising",
      "Weekly strategy calls",
      "Dedicated account manager",
      "Brand design services",
    ],
  },
];

const Services = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-hero">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              Our Services
            </span>
            <h1 className="section-heading mt-3 text-foreground">
              Comprehensive Marketing Solutions for{" "}
              <span className="text-gradient">Real Growth</span>
            </h1>
            <p className="section-subheading mt-4">
              From content creation to paid advertising, we provide everything
              you need to dominate your market and scale your business.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-24 bg-navy">
        <div className="container-wide space-y-24">
          {serviceCategories.map((service, index) => (
            <motion.div
              key={service.id}
              id={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Content */}
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <service.icon className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  {service.title}
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  {service.description}
                </p>
                <ul className="grid sm:grid-cols-2 gap-4">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Image */}
              <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gradient-to-b from-navy to-background">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              Pricing
            </span>
            <h2 className="section-heading mt-3 text-foreground">
              Flexible <span className="text-gradient">Packages</span>
            </h2>
            <p className="section-subheading mt-4 mx-auto">
              Choose a package that fits your needs, or let us create a custom
              solution for your business.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`card-premium p-8 relative ${
                  tier.popular ? "border-primary/50 ring-2 ring-primary/20" : ""
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary rounded-full text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {tier.name}
                </h3>
                <p className="text-muted-foreground mb-6">{tier.description}</p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link to="/contact">
                  <Button
                    variant={tier.popular ? "hero" : "heroOutline"}
                    className="w-full"
                  >
                    Request Quote
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground mb-4">
              Need a custom package tailored to your specific needs?
            </p>
            <Link to="/contact">
              <Button variant="heroOutline" size="lg" className="group">
                Request Custom Package
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
