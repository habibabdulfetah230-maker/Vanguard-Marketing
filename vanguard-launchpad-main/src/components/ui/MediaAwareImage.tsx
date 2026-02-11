import { useMedia } from "@/context/MediaContext";
import { cn } from "@/lib/utils";

interface MediaAwareImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: React.ReactNode;
  className?: string;
}

const MediaAwareImage = ({ 
  src, 
  alt, 
  fallback, 
  className, 
  ...props 
}: MediaAwareImageProps) => {
  const { settings } = useMedia();

  if (!settings?.enable_media) {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn("transition-opacity duration-300", className)}
      {...props}
    />
  );
};

export default MediaAwareImage;
