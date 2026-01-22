import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play, ExternalLink } from "lucide-react";

const categories = ["All", "Video", "Design", "Branding", "Full Projects"];

const portfolioItems = [
  {
    id: 1,
    category: "Video",
    title: "Brand Story Campaign",
    client: "TechVentures Ethiopia",
    description: "A cinematic brand story that increased engagement by 400%.",
    image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&h=600&fit=crop",
    hasVideo: true,
  },
  {
    id: 2,
    category: "Design",
    title: "Social Media Redesign",
    client: "Harar Coffee Co.",
    description: "Complete feed transformation that doubled follower growth.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
  },
  {
    id: 3,
    category: "Branding",
    title: "Complete Rebrand",
    client: "Addis Restaurant",
    description: "Full brand identity overhaul including logo, colors, and guidelines.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
  },
  {
    id: 4,
    category: "Full Projects",
    title: "360° Marketing Campaign",
    client: "Dire Dawa Real Estate",
    description: "Integrated campaign across all channels resulting in 50+ qualified leads.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
  },
  {
    id: 5,
    category: "Video",
    title: "Product Launch Video",
    client: "Fashion Boutique",
    description: "Viral product video with over 1M views across platforms.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
    hasVideo: true,
  },
  {
    id: 6,
    category: "Design",
    title: "Marketing Collateral",
    client: "Wellness Spa",
    description: "Full suite of marketing materials including brochures and flyers.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop",
  },
  {
    id: 7,
    category: "Branding",
    title: "Visual Identity System",
    client: "Tech Startup",
    description: "Modern brand identity that positioned them as industry innovators.",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop",
  },
  {
    id: 8,
    category: "Full Projects",
    title: "Launch Campaign",
    client: "E-commerce Brand",
    description: "Complete launch strategy including content, ads, and influencer partnerships.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
  },
];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems =
    activeCategory === "All"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory);

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
              Our Work
            </span>
            <h1 className="section-heading mt-3 text-foreground">
              Real Results,{" "}
              <span className="text-gradient">Real Transformations</span>
            </h1>
            <p className="section-subheading mt-4">
              Explore our portfolio of successful projects that have helped
              businesses grow and thrive in the digital space.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter & Portfolio */}
      <section className="py-24 bg-navy">
        <div className="container-wide">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Portfolio Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group card-premium overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  {/* Play Button */}
                  {item.hasVideo && (
                    <div className="absolute top-4 right-4">
                      <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center cursor-pointer hover:bg-primary transition-colors">
                        <Play className="w-5 h-5 text-primary-foreground fill-current" />
                      </div>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-secondary/90 backdrop-blur-sm rounded-full text-xs font-medium text-foreground">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-primary text-sm mb-3">{item.client}</p>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mt-16"
          >
            <p className="text-muted-foreground mb-4">
              Ready to see results like these for your business?
            </p>
            <Link to="/contact">
              <Button variant="hero" size="lg" className="group">
                Start Your Project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Portfolio;
