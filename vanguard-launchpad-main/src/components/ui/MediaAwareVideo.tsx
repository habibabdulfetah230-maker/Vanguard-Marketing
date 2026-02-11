import { useMedia } from "@/context/MediaContext";
import { cn } from "@/lib/utils";

interface MediaAwareVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  fallback?: React.ReactNode;
  className?: string;
}

const MediaAwareVideo = ({ 
  src, 
  fallback, 
  className, 
  children,
  ...props 
}: MediaAwareVideoProps) => {
  const { settings } = useMedia();

  if (!settings?.enable_media) {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <video
      src={src}
      className={cn("transition-opacity duration-300", className)}
      {...props}
    >
      {children}
    </video>
  );
};

export default MediaAwareVideo;
