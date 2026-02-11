import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchPublishedVideoProjects, fetchBrandingItems, fetchDesignItems, fetchFullProjects } from "@/lib/api";
import MediaAwareImage from "@/components/ui/MediaAwareImage";

export const PortfolioPreview = () => {
  const { data: videos } = useQuery({
    queryKey: ["published-videos"],
    queryFn: fetchPublishedVideoProjects,
  });

  const { data: branding } = useQuery({
    queryKey: ["branding-items"],
    queryFn: fetchBrandingItems,
  });

  const { data: design } = useQuery({
    queryKey: ["design-items"],
    queryFn: fetchDesignItems,
  });

  const { data: fullProjects } = useQuery({
    queryKey: ["full-projects"],
    queryFn: fetchFullProjects,
  });

  // Get first item from each category
  const portfolioItems = [
    ...(videos?.slice(0, 1).map(video => ({
      type: "Video",
      title: video.title,
      client: "Video Project",
      image: `https://img.youtube.com/vi/${video.youtubeVideoId}/maxresdefault.jpg`,
      link: `/portfolio#video-${video.id}`,
    })) || []),
    ...(design?.slice(0, 1).map(item => ({
      type: "Design",
      title: item.title,
      client: "Design Work",
      image: item.imageUrl,
      link: `/portfolio#design-${item.id}`,
    })) || []),
    ...(branding?.slice(0, 1).map(item => ({
      type: "Branding",
      title: item.title,
      client: "Branding Project",
      image: item.imageUrl,
      link: `/portfolio#branding-${item.id}`,
    })) || []),
    ...(fullProjects?.slice(0, 1).map(item => ({
      type: "Full Project",
      title: item.title,
      client: "Complete Work",
      image: item.imageUrl,
      link: `/portfolio#full-${item.id}`,
    })) || []),
  ];

  const isLoading = !videos || !branding || !design || !fullProjects;
  return (
    <section className="py-24 bg-gradient-to-b from-navy to-background">
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
            Our Work
          </span>
          <h2 className="section-heading mt-3 text-foreground">
            Sample <span className="text-gradient">Results</span>
          </h2>
          <p className="section-subheading mt-4 mx-auto">
            Real transformations and creative work that drive business growth.
          </p>
        </motion.div>

        {/* Portfolio Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : portfolioItems.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {portfolioItems.map((item, index) => (
              <motion.div
                key={`${item.type}-${item.title}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl aspect-[4/5] cursor-pointer"
              >
                {/* Image */}
                <MediaAwareImage
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  fallback={
                    <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-slate-600" />
                    </div>
                  }
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Play Button for Video */}
                {item.type === "Video" && (
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center">
                      <Play className="w-4 h-4 text-primary-foreground fill-current" />
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-primary text-xs font-semibold uppercase tracking-wider">
                    {item.type}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground mt-1">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    {item.client}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg">No portfolio items available yet.</p>
            <p className="text-sm mt-2">Check back soon for our latest work!</p>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link to="/portfolio">
            <Button variant="heroOutline" size="lg" className="group">
              View Full Portfolio
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
