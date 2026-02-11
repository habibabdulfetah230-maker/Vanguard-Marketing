import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { fetchMediaSettings, type MediaSettings } from "@/lib/mediaApi";

interface MediaContextValue {
  settings: MediaSettings | null;
  isLoading: boolean;
  refreshSettings: () => void;
}

const MediaContext = createContext<MediaContextValue | undefined>(undefined);

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error("useMedia must be used within a MediaProvider");
  }
  return context;
};

type MediaProviderProps = {
  children: ReactNode;
};

export const MediaProvider = ({ children }: MediaProviderProps) => {
  const [settings, setSettings] = useState<MediaSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSettings = async () => {
    setIsLoading(true);
    try {
      const mediaSettings = await fetchMediaSettings();
      setSettings(mediaSettings);
    } catch (error) {
      console.error("Failed to fetch media settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  const value: MediaContextValue = {
    settings,
    isLoading,
    refreshSettings,
  };

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
};
