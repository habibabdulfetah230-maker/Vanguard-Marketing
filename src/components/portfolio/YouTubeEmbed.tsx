import { useState } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

interface YouTubeEmbedProps {
  videoId: string;
  title: string;
  thumbnailUrl?: string;
}

export const YouTubeEmbed = ({ videoId, title, thumbnailUrl }: YouTubeEmbedProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const defaultThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const thumbnail = thumbnailUrl || defaultThumbnail;

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-secondary">
      {!isPlaying ? (
        <motion.div
          className="relative w-full h-full cursor-pointer group"
          onClick={handlePlay}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {/* Thumbnail */}
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-60 group-hover:opacity-70 transition-opacity" />
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-lg group-hover:bg-primary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-7 h-7 md:w-8 md:h-8 text-primary-foreground fill-current ml-1" />
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      )}
    </div>
  );
};
