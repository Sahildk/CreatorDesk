import { useMemo, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { FilterSidebar } from '@/components/FilterSidebar';
import { CreatorCard } from '@/components/CreatorCard';
import { AIRecommendations } from '@/components/AIRecommendations';
import { computeRelevanceScore } from '@/lib/ai/scorer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Frown } from 'lucide-react';

export default function Creators() {
  const { creators, activeCampaignId, campaigns, filters } = useAppStore();
  const activeCamp = campaigns.find(c => c.id === activeCampaignId);
  const [sortBy, setSortBy] = useState('relevance');

  const filteredCreators = useMemo(() => {
    let result = [...creators];

    // Filter Platform
    if (filters.platforms.length > 0) {
      result = result.filter(c => filters.platforms.includes(c.platform));
    }

    // Filter Niches
    if (filters.niches.length > 0) {
      result = result.filter(c => {
        const matchesPrimary = filters.niches.includes(c.primary_niche);
        const matchesSecondary = c.secondary_niche && filters.niches.includes(c.secondary_niche);
        return matchesPrimary || matchesSecondary;
      });
    }

    // Filter Min Followers
    if (filters.minFollowers > 0) {
      result = result.filter(c => c.followers >= filters.minFollowers);
    }

    // AI Picks Only
    if (filters.aiPicksOnly && activeCamp) {
      // Sort by relevance and take top 5
      result = result
        .sort((a, b) => computeRelevanceScore(b, activeCamp) - computeRelevanceScore(a, activeCamp))
        .slice(0, 5);
    } else {
      // Sort
      result.sort((a, b) => {
        if (sortBy === 'followers') return b.followers - a.followers;
        if (sortBy === 'engagement') return b.engagement_rate - a.engagement_rate;
        if (sortBy === 'cost-low') return a.cost_per_post - b.cost_per_post;
        // Default to relevance if activeCamp exists
        if (activeCamp) return computeRelevanceScore(b, activeCamp) - computeRelevanceScore(a, activeCamp);
        return 0;
      });
    }

    return result;
  }, [creators, filters, activeCamp, sortBy]);

  return (
    <div className="flex flex-col h-full overflow-hidden absolute inset-0 pt-6">
      <div className="px-6 flex justify-between items-end mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Creator Discovery</h1>
          {activeCamp ? (
             <p className="text-muted-foreground">Finding matches for <span className="text-violet-400 font-medium">#{activeCamp.code}</span></p>
          ) : (
             <p className="text-amber-500/80">No active campaign selected. Showing all creators. Go to Campaigns to select one.</p>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground mr-2">Sort by</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-card/50 border-border/50">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">AI Relevance</SelectItem>
              <SelectItem value="followers">Highest Followers</SelectItem>
              <SelectItem value="engagement">Highest Engagement</SelectItem>
              <SelectItem value="cost-low">Cost (Low to High)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden w-full relative">
        <div className="w-64 shrink-0 shrink-0 h-full overflow-hidden hidden md:block pl-6 pb-6">
          <FilterSidebar />
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 pb-20 scroll-smooth">
          {filters.aiPicksOnly === false && <AIRecommendations />}
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCreators.map(creator => (
              <CreatorCard key={creator.id} creator={creator} campaign={activeCamp} />
            ))}
          </div>
          
          {filteredCreators.length === 0 && (
            <div className="flex flex-col items-center justify-center p-20 text-center border border-dashed rounded-xl border-border/50 bg-black/10 mt-6">
              <Frown size={48} className="text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">No creators found</h3>
              <p className="text-muted-foreground max-w-md">Try adjusting your filters or turn off "AI Picks Only" to see more results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
