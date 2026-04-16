import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/card';
import { computeProfileScore } from '@/lib/ai/scorer';

export default function Analytics() {
  const { creators, campaigns, classifications } = useAppStore();

  const totalCreators = creators.length;
  
  // Platform distribution
  const platformCounts = creators.reduce((acc, c) => {
    acc[c.platform] = (acc[c.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Average Engagement
  const avgEngagement = totalCreators > 0 
    ? (creators.reduce((sum, c) => sum + c.engagement_rate, 0) / totalCreators).toFixed(1)
    : 0;

  // Profile Completeness Avg
  const avgCompleteness = totalCreators > 0
    ? (creators.reduce((sum, c) => sum + computeProfileScore(c).score, 0) / totalCreators).toFixed(0)
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Analytics</h1>
        <p className="text-muted-foreground">Database overview and campaign metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="text-sm font-medium text-muted-foreground mb-2">Total Database</div>
          <div className="text-4xl font-bold">{totalCreators}</div>
        </Card>
        
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="text-sm font-medium text-muted-foreground mb-2">Active Campaigns</div>
          <div className="text-4xl font-bold text-violet-400">{campaigns.length}</div>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="text-sm font-medium text-muted-foreground mb-2">Avg. Engagement</div>
          <div className="text-4xl font-bold text-green-400">{avgEngagement}%</div>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="text-sm font-medium text-muted-foreground mb-2">Profile Completeness</div>
          <div className="text-4xl font-bold text-blue-400">{avgCompleteness}%</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <h3 className="font-semibold mb-6">Platform Distribution</h3>
          <div className="space-y-4">
            {Object.entries(platformCounts).map(([platform, count]) => {
              const pct = Math.round((count / totalCreators) * 100);
              return (
                <div key={platform}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{platform}</span>
                    <span className="text-muted-foreground">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-violet-500 rounded-full" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 overflow-auto">
          <h3 className="font-semibold mb-6">Campaign Funnels</h3>
          <div className="space-y-6">
            {campaigns.length === 0 ? (
              <div className="text-muted-foreground text-sm">No campaigns to display.</div>
            ) : campaigns.map(camp => {
              const cla = classifications[camp.id] || {};
              const sCount = Object.values(cla).filter(v => v === 'shortlisted').length;
              const bCount = Object.values(cla).filter(v => v === 'backup').length;
              const rCount = Object.values(cla).filter(v => v === 'rejected').length;
              
              const totalTouched = sCount + bCount + rCount;
              if (totalTouched === 0) return null;

              return (
                <div key={camp.id} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
                  <div className="font-medium text-sm mb-3 text-violet-300">{camp.name}</div>
                  <div className="flex bg-black/40 h-6 rounded-full overflow-hidden text-[10px] font-bold">
                    {sCount > 0 && <div className="bg-green-500/80 flex items-center justify-center text-black" style={{ width: `${(sCount/totalTouched)*100}%` }}>{sCount} S</div>}
                    {bCount > 0 && <div className="bg-yellow-500/80 flex items-center justify-center text-black" style={{ width: `${(bCount/totalTouched)*100}%` }}>{bCount} B</div>}
                    {rCount > 0 && <div className="bg-red-500/80 flex items-center justify-center text-black" style={{ width: `${(rCount/totalTouched)*100}%` }}>{rCount} R</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
