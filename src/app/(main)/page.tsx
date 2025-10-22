import { FeaturedProducts } from "@/components/homepage/featured-products";
import { HeroSection } from "@/components/homepage/hero-section";
import { YouTubeVideoSection } from "@/components/homepage/youtube-video-section";
import { homepageSettings } from "@/lib/settings";


export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturedProducts />
      {homepageSettings.youtubeVideoId && (
        <YouTubeVideoSection 
            videoId={homepageSettings.youtubeVideoId}
            title={homepageSettings.youtubeVideoTitle}
            description={homepageSettings.youtubeVideoDescription}
        />
      )}
    </div>
  );
}
