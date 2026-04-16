import { useAppStore } from '@/store/useAppStore';
import { recommendCreators } from '@/lib/ai/scorer';
import { CreatorCard } from './CreatorCard';
import { Sparkles } from 'lucide-react';

export function AIRecommendations() {
  const { creators, campaigns, activeCampaignId } = useAppStore();
  const activeCamp = campaigns.find(c => c.id === activeCampaignId);

  if (!activeCamp) return null;

  const topPicks = recommendCreators(creators, activeCamp, 3);

  if (topPicks.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 rounded-xl border border-violet-500/20 p-5 mt-2 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
          <Sparkles size={16} className="text-violet-400" />
        </div>
        <h3 className="font-semibold text-violet-200">AI Top Picks for "{activeCamp.name}"</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topPicks.map(creator => (
          <CreatorCard key={creator.id} creator={creator} campaign={activeCamp} />
        ))}
      </div>
    </div>
  );
}
