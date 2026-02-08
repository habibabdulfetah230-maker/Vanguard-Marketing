import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Play, ExternalLink } from "lucide-react";
import { VideoCard } from "@/components/portfolio/VideoCard";

const categories = ["All", "Video", "Design", "Branding", "Full Projects"];

// Video portfolio items with YouTube IDs
const videoItems = [
  {
    id: "v1",
    category: "Video",
    videoId: "dQw4w9WgXcQ", // Replace with actual video IDs
    title: "Brand Story Campaign",
    description: "A cinematic brand story that increased engagement by 400%.",
  },
  {
    id: "v2",
    category: "Video",
    videoId: "9bZkp7q19f0", // Replace with actual video IDs
    title: "Product Launch Video",
    description: "Viral product video with over 1M views across platforms.",
  },
  {
    id: "v3",
    category: "Video",
    videoId: "kJQP7kiw5Fk", // Replace with actual video IDs
    title: "Corporate Documentary",
    description: "Behind-the-scenes look at company culture and values.",
  },
];

// Image-based portfolio items
const portfolioItems = [
  {
    id: 1,
    category: "Design",
    title: "Social Media Redesign",
    client: "Harar Coffee Co.",
    description: "Complete feed transformation that doubled follower growth.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
  },
  {
    id: 2,
    category: "Branding",
    title: "Complete Rebrand",
    client: "Addis Restaurant",
    description: "Full brand identity overhaul including logo, colors, and guidelines.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
  },
  {
    id: 3,
    category: "Full Projects",
    title: "360° Marketing Campaign",
    client: "Dire Dawa Real Estate",
    description: "Integrated campaign across all channels resulting in 50+ qualified leads.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
  },
  {
    id: 4,
    category: "Design",
    title: "Marketing Collateral",
    client: "Wellness Spa",
    description: "Full suite of marketing materials including brochures and flyers.",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop",
  },
  {
    id: 5,
    category: "Branding",
    title: "Visual Identity System",
    client: "Tech Startup",
    description: "Modern brand identity that positioned them as industry innovators.",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop",
  },
  {
    id: 6,
    category: "Full Projects",
    title: "Launch Campaign",
    client: "E-commerce Brand",
    description: "Complete launch strategy including content, ads, and influencer partnerships.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
  },
];

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredVideoItems =
    activeCategory === "All" || activeCategory === "Video"
      ? videoItems
      : [];

  const filteredImageItems =
    activeCategory === "All"
      ? portfolioItems
      : activeCategory === "Video"
      ? []
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

          {/* Video Portfolio Grid */}
          {filteredVideoItems.length > 0 && (
            <>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl font-semibold text-foreground mb-8"
              >
                Video Projects
              </motion.h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {filteredVideoItems.map((item, index) => (
                  <VideoCard
                    key={item.id}
                    videoId={item.videoId}
                    title={item.title}
                    description={item.description}
                    category={item.category}
                    index={index}
                  />
                ))}
              </div>
            </>
          )}

          {/* Image Portfolio Grid */}
          {filteredImageItems.length > 0 && (
            <>
              {filteredVideoItems.length > 0 && (
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-2xl font-semibold text-foreground mb-8"
                >
                  Design & Branding Projects
                </motion.h3>
              )}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredImageItems.map((item, index) => (
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
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

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
            </>
          )}

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
