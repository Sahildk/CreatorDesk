import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';

const PLATFORMS = ['Instagram', 'YouTube', 'Twitter'];
const ALL_NICHES = ['Fashion', 'Lifestyle', 'Tech', 'Food', 'Travel', 'Finance', 'Crypto', 'Gaming', 'Fitness', 'Diet', 'Business', 'Startups', 'Education', 'Career'];

export function FilterSidebar() {
  const { filters, setFilter, resetFilters } = useAppStore();

  const handlePlatformChange = (platform: string, checked: boolean) => {
    if (checked) {
      setFilter('platforms', [...filters.platforms, platform]);
    } else {
      setFilter('platforms', filters.platforms.filter(p => p !== platform));
    }
  };

  const handleNicheChange = (niche: string, checked: boolean) => {
    if (checked) {
      setFilter('niches', [...filters.niches, niche]);
    } else {
      setFilter('niches', filters.niches.filter(n => n !== niche));
    }
  };

  return (
    <Card className="w-64 h-full flex flex-col bg-black/40 backdrop-blur-xl border-white/10 rounded-xl overflow-hidden shadow-2xl">
      <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/5">
        <h3 className="font-bold text-sm tracking-widest text-violet-100 uppercase">Filters</h3>
        <button 
          onClick={resetFilters}
          className="text-xs text-violet-400 hover:text-violet-300 transition-colors bg-violet-500/10 px-2 py-1 rounded"
        >
          Reset All
        </button>
      </div>
      
      <div className="p-5 flex flex-col gap-6 overflow-y-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="ai-picks" className="flex items-center gap-2 cursor-pointer font-medium text-violet-200">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse-glow" />
              AI Picks Only
            </Label>
            <Switch 
              id="ai-picks" 
              checked={filters.aiPicksOnly}
              onCheckedChange={(v) => setFilter('aiPicksOnly', v)}
              className="data-[state=checked]:bg-violet-600"
            />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Only show top 5 creators ranked by relevance for the active campaign.
          </p>
        </div>

        <Separator className="bg-white/5" />

        <div className="space-y-3">
          <Label className="uppercase text-xs font-semibold text-muted-foreground tracking-wider">Platform</Label>
          <div className="space-y-2.5">
            {PLATFORMS.map(platform => (
              <div key={platform} className="flex items-center space-x-2">
                <Checkbox 
                  id={`p-${platform}`} 
                  checked={filters.platforms.includes(platform)}
                  onCheckedChange={(c) => handlePlatformChange(platform, c as boolean)}
                  className="border-white/20 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                />
                <Label htmlFor={`p-${platform}`} className="cursor-pointer text-sm font-medium">{platform}</Label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-white/5" />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="uppercase text-xs font-semibold text-muted-foreground tracking-wider">Min Followers</Label>
            <span className="text-xs font-medium text-violet-300">{(filters.minFollowers / 1000).toFixed(0)}k</span>
          </div>
          <Slider
            defaultValue={[0]}
            max={1000000}
            step={10000}
            value={[filters.minFollowers]}
            onValueChange={([val]) => setFilter('minFollowers', val)}
            className="w-full"
          />
        </div>

        <Separator className="bg-white/5" />

         <div className="space-y-3">
          <Label className="uppercase text-xs font-semibold text-muted-foreground tracking-wider">Niches</Label>
          <div className="space-y-2.5">
            {ALL_NICHES.map(niche => (
              <div key={niche} className="flex items-center space-x-2">
                <Checkbox 
                  id={`n-${niche}`}
                  checked={filters.niches.includes(niche)}
                  onCheckedChange={(c) => handleNicheChange(niche, c as boolean)}
                  className="border-white/20 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                />
                <Label htmlFor={`n-${niche}`} className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">{niche}</Label>
              </div>
            ))}
          </div>
        </div>

      </div>
    </Card>
  );
}
