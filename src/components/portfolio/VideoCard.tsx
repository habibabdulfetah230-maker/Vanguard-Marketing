import { motion } from "framer-motion";
import { YouTubeEmbed } from "./YouTubeEmbed";

interface VideoCardProps {
  videoId: string;
  title: string;
  description?: string;
  category: string;
  index: number;
}

export const VideoCard = ({ videoId, title, description, category, index }: VideoCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group card-premium overflow-hidden"
    >
      {/* Video Player */}
      <div className="relative">
        <YouTubeEmbed videoId={videoId} title={title} />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-secondary/90 backdrop-blur-sm rounded-full text-xs font-medium text-foreground">
            {category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-muted-foreground text-sm line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
};
