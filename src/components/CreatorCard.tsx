import { Creator, Campaign, CreatorStatus } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Check, Clock, X, AlertCircle, Briefcase, Camera, Video, MessageCircle } from 'lucide-react';
import { computeRelevanceScore, computeProfileScore } from '@/lib/ai/scorer';
import { useAppStore } from '@/store/useAppStore';

interface Props {
  creator: Creator;
  campaign?: Campaign | null;
  compact?: boolean;
}

export function CreatorCard({ creator, campaign, compact = false }: Props) {
  const { setCreatorStatus, classifications } = useAppStore();
  
  const relevance = campaign ? computeRelevanceScore(creator, campaign) : null;
  const { missing: rawMissing } = computeProfileScore(creator);
  
  // Format missing nicely
  const missing = rawMissing.map(m => m.replace('contact_', '').replace('_', ' '));
  
  const status = campaign ? classifications[campaign.id]?.[creator.id] || "pending" : "pending";

  const getPlatformIcon = () => {
    switch(creator.platform) {
      case 'Instagram': return <Camera size={14} className="text-pink-500" />;
      case 'YouTube': return <Video size={14} className="text-red-500" />;
      case 'Twitter': return <MessageCircle size={14} className="text-blue-400" />;
      default: return <Briefcase size={14} />;
    }
  };

  const handleStatus = (newStatus: CreatorStatus) => {
    if (campaign) {
      setCreatorStatus(campaign.id, creator.id, newStatus);
    }
  };

  if (compact) {
    return (
      <Card className="p-3 flex flex-col gap-3 bg-card/50 backdrop-blur-sm border-border/50 hover:border-violet-500/30 transition-all cursor-grab active:cursor-grabbing">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 ring-1 ring-border">
            <AvatarFallback className="bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-violet-300">
              {creator.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{creator.name}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              {getPlatformIcon()}
              <span>{(creator.followers / 1000).toFixed(1)}k</span>
              <span>•</span>
              <span className="truncate">{creator.primary_niche}</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden bg-card/60 backdrop-blur-md border-border/50 hover:border-violet-500/50 transition-all duration-300 animate-fade-in-up group">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-4 items-center">
            <Avatar className="h-12 w-12 ring-2 ring-background shadow-lg">
              <AvatarFallback className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-medium">
                {creator.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg leading-tight group-hover:text-violet-400 transition-colors">
                {creator.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-white/5 hover:bg-white/10 text-xs gap-1 font-normal">
                  {getPlatformIcon()}
                  {creator.platform}
                </Badge>
                <div className="text-sm text-muted-foreground">{creator.city}</div>
              </div>
            </div>
          </div>
          {relevance !== null && (
            <div className="flex flex-col items-end">
              <div className="text-xs text-muted-foreground mb-1 uppercase font-medium tracking-wider">AI Match</div>
              <Badge variant={relevance > 80 ? "default" : relevance > 50 ? "secondary" : "outline"} 
                className={relevance > 80 ? "bg-gradient-to-r from-violet-500 to-indigo-500 shadow-[0_0_15px_rgba(124,58,237,0.3)]" : ""}>
                {relevance}%
              </Badge>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <Badge variant="outline" className="bg-white/5 text-xs font-normal border-border/40">
            {creator.primary_niche}
          </Badge>
          {creator.secondary_niche && (
            <Badge variant="outline" className="bg-white/5 text-xs font-normal border-border/40">
              {creator.secondary_niche}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5 bg-black/20 p-3 rounded-lg border border-white/5">
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">Followers</div>
            <div className="font-medium">{(creator.followers / 1000).toFixed(1)}k</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">Engagement</div>
            <div className="font-medium text-green-400">{creator.engagement_rate}%</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">Avg Views</div>
            <div className="font-medium">{(creator.avg_views / 1000).toFixed(1)}k</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">Cost</div>
            <div className="font-medium">₹{creator.cost_per_post.toLocaleString()}</div>
          </div>
        </div>

        {missing.length > 0 && (
          <div className="mb-4 flex gap-2 items-center text-xs text-amber-500/90 bg-amber-500/10 p-2 rounded-md border border-amber-500/20">
            <AlertCircle size={14} className="shrink-0" />
            <span className="truncate" title={`Missing: ${missing.join(', ')}`}>
              Missing: {missing.join(', ')}
            </span>
          </div>
        )}

      </div>
      
      {campaign && (
        <div className="border-t border-border/50 p-3 bg-black/10 flex gap-2">
          {status === "shortlisted" ? (
             <Button className="w-full bg-green-500/20 text-green-400 hover:bg-green-500/30 border-none" variant="outline" onClick={() => handleStatus("pending")}>
               <Check size={16} className="mr-2" /> Shortlisted
             </Button>
          ) : status === "backup" ? (
            <Button className="w-full bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border-none" variant="outline" onClick={() => handleStatus("pending")}>
              <Clock size={16} className="mr-2" /> Backup
            </Button>
          ) : status === "rejected" ? (
            <Button className="w-full bg-red-500/20 text-red-400 hover:bg-red-500/30 border-none" variant="outline" onClick={() => handleStatus("pending")}>
              <X size={16} className="mr-2" /> Rejected
            </Button>
          ) : (
            <>
              <Button onClick={() => handleStatus("shortlisted")} variant="outline" className="flex-1 hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/50">
                <Check size={16} />
              </Button>
              <Button onClick={() => handleStatus("backup")} variant="outline" className="flex-1 hover:bg-yellow-500/20 hover:text-yellow-400 hover:border-yellow-500/50">
                <Clock size={16} />
              </Button>
              <Button onClick={() => handleStatus("rejected")} variant="outline" className="flex-1 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50">
                <X size={16} />
              </Button>
            </>
          )}
        </div>
      )}
    </Card>
  );
}
