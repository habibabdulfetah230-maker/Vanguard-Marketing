import { useMedia } from "@/context/MediaContext";

export const useMediaAware = () => {
  const { settings } = useMedia();
  
  return {
    isMediaEnabled: settings?.enable_media ?? true,
    isLoading: !settings,
  };
};
