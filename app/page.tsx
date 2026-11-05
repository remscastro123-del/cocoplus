import Navigation1 from "@/components/navigation-1";
import { Hero17 } from "@/components/hero-17";
import Ecommerce6 from "@/components/ecommerce-6";
import Features7 from "@/components/features-7";
import ProcessStory from "@/components/process-story";
import SocialProof1 from "@/components/social-proof-1";
import { Blog1 } from "@/components/blog-1";
import Footer3 from "@/components/footer-3";
import { MotionProvider } from "@/components/motion-provider";
import { Preloader } from "@/components/preloader";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Chatbot } from "@/components/chatbot";
import { CookieNotice } from "@/components/cookie-notice";

// Homepage order: products first (product-centric), then the company and
// process story, proof (certifications, affiliations), news, contact.
export default function Home() {
  return (
    <MotionProvider>
    <Preloader />
    <SmoothScroll />
    <div className="flex flex-col" style={{ ["--rb-section-min-h" as string]: "0px" }}>
      <Navigation1 />
      <main className="flex flex-col">
        <Hero17 />
        <Ecommerce6 />
        <Features7 />
        <ProcessStory />
        <SocialProof1 />
        <Blog1 />
      </main>
      <Footer3 />
    </div>
    <Chatbot />
    <CookieNotice />
    </MotionProvider>
  );
}
