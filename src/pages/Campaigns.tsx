import { useState } from 'react';
import { Campaign } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderOpen, MoreHorizontal, FileSpreadsheet } from 'lucide-react';
import { CampaignModal } from '@/components/CampaignModal';
import { SheetsSync } from '@/components/SheetsSync';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function Campaigns() {
  const { campaigns, setActiveCampaign, classifications, deleteCampaign } = useAppStore();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [sheetsOpen, setSheetsOpen] = useState(false);

  const handleCreateNew = () => {
    setEditingCampaign(null);
    setModalOpen(true);
  };

  const handleEditCampaign = (camp: Campaign) => {
    setEditingCampaign(camp);
    setModalOpen(true);
  };

  const handleOpenCampaign = (id: string) => {
    setActiveCampaign(id);
    navigate('/creators');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Campaign Hub</h1>
          <p className="text-muted-foreground">Manage your influencer marketing campaigns.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20 hover:text-green-300" onClick={() => setSheetsOpen(true)}>
            <FileSpreadsheet size={16} className="mr-2" />
            Sheets Sync
          </Button>
          <Button onClick={handleCreateNew} className="bg-white text-black hover:bg-white/90">
            <Plus size={16} className="mr-2" /> New Campaign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create New Card */}
        <Card 
          className="flex flex-col items-center justify-center p-8 border-dashed border-2 bg-transparent hover:bg-white/5 transition-colors cursor-pointer group h-64"
          onClick={handleCreateNew}
        >
          <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-violet-500/20 group-hover:text-violet-400">
            <Plus size={24} />
          </div>
          <h3 className="font-medium text-lg">Create New Campaign</h3>
          <p className="text-sm text-muted-foreground text-center mt-2 max-w-[200px]">Setup code, niches and start discovering creators</p>
        </Card>

        {/* Existing Campaigns */}
        {campaigns.map(camp => {
          const campClass = classifications[camp.id] || {};
          const shortlistCount = Object.values(campClass).filter(v => v === 'shortlisted').length;
          const backupCount = Object.values(campClass).filter(v => v === 'backup').length;
          
          return (
            <Card key={camp.id} className="relative overflow-hidden group h-64 flex flex-col hover:border-violet-500/30 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-background/50 hover:bg-background/80">
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditCampaign(camp)}>Edit Campaign</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-400" onClick={() => deleteCampaign(camp.id)}>Archive</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-2 uppercase text-xs font-bold tracking-wider text-violet-400">
                  {camp.code}
                </div>
                <h3 className="text-xl font-semibold mb-3 line-clamp-1">{camp.name}</h3>
                
                <div className="flex flex-wrap gap-1.5 mb-auto">
                  {camp.niches.slice(0, 3).map(niche => (
                    <Badge key={niche} variant="secondary" className="bg-white/10">{niche}</Badge>
                  ))}
                  {camp.niches.length > 3 && (
                    <Badge variant="secondary" className="bg-white/10">+{camp.niches.length - 3}</Badge>
                  )}
                </div>

                <div className="mt-6 flex justify-between items-end border-t border-border/50 pt-4">
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Shortlisted</span>
                      <span className="font-semibold text-lg">{shortlistCount}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Backup</span>
                      <span className="font-semibold text-lg text-yellow-500/80">{backupCount}</span>
                    </div>
                  </div>
                  
                  <Button variant="secondary" size="sm" onClick={() => handleOpenCampaign(camp.id)}>
                    <FolderOpen size={14} className="mr-2" /> Open
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <CampaignModal open={modalOpen} onOpenChange={setModalOpen} campaignToEdit={editingCampaign} />
      <SheetsSync open={sheetsOpen} onOpenChange={setSheetsOpen} />
    </div>
  );
}
