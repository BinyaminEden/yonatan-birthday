import { Hero } from "@/components/hero";
import { BlessingForm } from "@/components/blessing-form";
import { BlessingsFeed } from "@/components/blessings-feed";
import { FactGenerator } from "@/components/fact-generator";
import { MissionCard } from "@/components/mission-card";
import { PhotoAlbum } from "@/components/photo-album";
import { StoryTimeline } from "@/components/story-timeline";
import { SiteFooter } from "@/components/footer";
import { getPublicClient, hasSupabaseConfig, type Blessing } from "@/lib/supabase";

export const revalidate = 0;

async function loadBlessings(): Promise<Blessing[]> {
  if (!hasSupabaseConfig()) return [];
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from("blessings")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return (data ?? []) as Blessing[];
  } catch {
    return [];
  }
}

export default async function Home() {
  const blessings = await loadBlessings();

  return (
    <>
      <Hero />

      <section className="max-w-6xl mx-auto px-5 py-14">
        <div className="grid lg:grid-cols-2 gap-6">
          <BlessingForm />
          <div className="grid gap-6">
            <FactGenerator />
            <MissionCard />
          </div>
        </div>
      </section>

      <BlessingsFeed blessings={blessings} />
      <PhotoAlbum />
      <StoryTimeline />
      <SiteFooter />
    </>
  );
}
