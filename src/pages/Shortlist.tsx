import { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { CreatorCard } from '@/components/CreatorCard';
import { CreatorStatus } from '@/types';
import { AlertCircle, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadCsv } from '@/lib/csvUtils';

export default function Shortlist() {
  const { creators, activeCampaignId, campaigns, classifications, setCreatorStatus } = useAppStore();
  const activeCamp = campaigns.find(c => c.id === activeCampaignId);
  const campClass = classifications[activeCampaignId || ''] || {};

  const columns: { id: CreatorStatus, title: string, color: string }[] = [
    { id: 'shortlisted', title: 'Shortlisted', color: 'border-green-500/50 bg-green-500/5' },
    { id: 'backup', title: 'Backup', color: 'border-yellow-500/50 bg-yellow-500/5' },
    { id: 'rejected', title: 'Rejected', color: 'border-red-500/50 bg-red-500/5' },
  ];

  const columnCreators = useMemo(() => {
    const res: Record<string, typeof creators> = { shortlisted: [], backup: [], rejected: [] };
    creators.forEach(c => {
      const status = campClass[c.id];
      if (status && status !== 'pending') {
        res[status].push(c);
      }
    });
    return res;
  }, [creators, campClass]);

  const totalBudget = columnCreators.shortlisted.reduce((sum, c) => sum + c.cost_per_post, 0);

  const handleDrop = (creatorId: string, status: CreatorStatus) => {
    if (activeCampaignId) {
      setCreatorStatus(activeCampaignId, creatorId, status);
    }
  };

  if (!activeCamp) {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center">
        <AlertCircle size={48} className="text-amber-500 mb-4 opacity-50" />
        <h2 className="text-2xl font-semibold mb-2">No Campaign Selected</h2>
        <p className="text-muted-foreground mb-6">You need to select a campaign to view its shortlist.</p>
        <Button onClick={() => window.location.href = '/'}>Go to Campaigns</Button>
      </div>
    );
  }

  const handleExport = () => {
    const exportData = columnCreators.shortlisted.map(c => ({
      Campaign: activeCamp?.name,
      Creator_ID: c.id,
      Name: c.name,
      Platform: c.platform,
      Primary_Niche: c.primary_niche,
      Followers: c.followers,
      Contact_Email: c.contact_email,
      Cost: c.cost_per_post
    }));
    downloadCsv(exportData, `shortlist-${activeCamp.code}.csv`);
  };

  return (
    <div className="flex flex-col h-full absolute inset-0 pt-6 px-6 pb-6">
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Shortlist Manager</h1>
          <p className="text-muted-foreground">Kanban board for <span className="text-violet-400 font-medium">#{activeCamp.code}</span></p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col text-right">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Total Budget</span>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-400">
              ₹{totalBudget.toLocaleString()}
            </span>
          </div>
          <Button onClick={handleExport} className="bg-white text-black hover:bg-white/90">
            <FileSpreadsheet size={16} className="mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 h-full min-w-[900px]">
          {columns.map(col => (
             <div 
               key={col.id} 
               className={`flex-1 flex flex-col rounded-xl border ${col.color} p-4 transition-colors`}
               onDragOver={(e) => {
                 e.preventDefault();
                 e.dataTransfer.dropEffect = 'move';
               }}
               onDrop={(e) => {
                 e.preventDefault();
                 const creatorId = e.dataTransfer.getData('creatorId');
                 if (creatorId) {
                   handleDrop(creatorId, col.id);
                 }
               }}
             >
               <div className="flex justify-between items-center mb-4 px-1">
                 <h3 className="font-semibold">{col.title}</h3>
                 <span className="bg-black/30 px-2 py-0.5 rounded text-xs text-muted-foreground">
                   {columnCreators[col.id].length}
                 </span>
               </div>
               
               <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 pb-4 plugin-scrollbar-hidden">
                 {columnCreators[col.id].map(creator => (
                   <div
                     key={creator.id}
                     draggable
                     onDragStart={(e) => {
                       e.dataTransfer.setData('creatorId', creator.id);
                       e.dataTransfer.effectAllowed = 'move';
                     }}
                     className="cursor-grab active:cursor-grabbing hover:-translate-y-0.5 transition-transform"
                   >
                     <CreatorCard creator={creator} compact />
                   </div>
                 ))}
                 
                 {columnCreators[col.id].length === 0 && (
                   <div className="flex-1 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center p-8 pointer-events-none">
                     <span className="text-sm text-muted-foreground/50">Drop here</span>
                   </div>
                 )}
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
