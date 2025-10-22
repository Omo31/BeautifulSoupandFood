import { FeaturedProducts } from "@/components/homepage/featured-products";
import { HeroSection } from "@/components/homepage/hero-section";
import { YouTubeVideoSection } from "@/components/homepage/youtube-video-section";

// In a real app, this would be fetched from your Firestore settings.
const homepageSettings = {
  youtubeVideoId: 'dQw4w9WgXcQ' 
};

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturedProducts />
      {homepageSettings.youtubeVideoId && (
        <YouTubeVideoSection videoId={homepageSettings.youtubeVideoId} />
      )}
    </div>
  );
}
