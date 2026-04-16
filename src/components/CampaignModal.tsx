import { useState, useEffect, FormEvent } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { Campaign } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

const ALL_NICHES = ['Fashion', 'Lifestyle', 'Tech', 'Food', 'Travel', 'Finance', 'Crypto', 'Gaming', 'Fitness', 'Diet', 'Business', 'Startups', 'Education', 'Career'];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignToEdit?: Campaign | null;
}

export function CampaignModal({ open, onOpenChange, campaignToEdit }: Props) {
  const { addCampaign, updateCampaign } = useAppStore();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [niches, setNiches] = useState<string[]>([]);
  const [goal, setGoal] = useState('');

  useEffect(() => {
    if (campaignToEdit) {
      setName(campaignToEdit.name);
      setCode(campaignToEdit.code);
      setNiches(campaignToEdit.niches);
      setGoal(campaignToEdit.goal || '');
    } else {
      setName('');
      setCode('');
      setNiches([]);
      setGoal('');
    }
  }, [campaignToEdit, open]);

  const handleNicheToggle = (niche: string) => {
    setNiches(prev => 
      prev.includes(niche) ? prev.filter(n => n !== niche) : [...prev, niche]
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !code || niches.length === 0) return;
    
    // Auto slugify code if not explicitly formatted
    const formattedCode = code.toUpperCase().replace(/\s+/g, '-');
    
    if (campaignToEdit) {
      updateCampaign({
        ...campaignToEdit,
        name,
        code: formattedCode,
        niches,
        goal
      });
      onOpenChange(false);
    } else {
      const newCampaign = {
        id: crypto.randomUUID(),
        code: formattedCode,
        name,
        niches,
        goal,
        startDate: new Date().toISOString().split('T')[0]
      };
      
      addCampaign(newCampaign);
      onOpenChange(false);
      navigate('/creators');
    }
    
    // Reset form
    setName('');
    setCode('');
    setNiches([]);
    setGoal('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-background border-border shadow-2xl backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{campaignToEdit ? 'Edit Campaign' : 'Create New Campaign'}</DialogTitle>
          <DialogDescription>
            {campaignToEdit ? 'Update your campaign details and niches.' : 'Setup your campaign to let AI discover the best creators for your requirements.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right text-muted-foreground">Code <span className="text-red-400">*</span></Label>
            <Input id="code" value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. SUMMER-26" className="col-span-3 bg-white/5" required />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-muted-foreground">Name <span className="text-red-400">*</span></Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Summer Essentials Drop" className="col-span-3 bg-white/5" required />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right mt-2 text-muted-foreground">Niches <span className="text-red-400">*</span></Label>
            <div className="col-span-3">
              <div className="flex flex-wrap gap-2 p-3 bg-black/20 rounded-md border border-white/5 max-h-40 overflow-y-auto">
                {ALL_NICHES.map(niche => {
                  const isSelected = niches.includes(niche);
                  return (
                    <Badge 
                      key={niche}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        isSelected ? 'bg-violet-600 hover:bg-violet-700' : 'bg-transparent border-border/40 hover:border-violet-500/50 hover:bg-white/5'
                      }`}
                      onClick={() => handleNicheToggle(niche)}
                    >
                      {niche}
                    </Badge>
                  );
                })}
              </div>
              {niches.length === 0 && <p className="text-xs text-amber-500 mt-2">Please select at least one niche.</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="goal" className="text-right mt-2 text-muted-foreground">Goal</Label>
            <Textarea id="goal" value={goal} onChange={e => setGoal(e.target.value)} placeholder="What are you trying to achieve?" className="col-span-3 bg-white/5 resize-none h-20" />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={!name || !code || niches.length === 0} className="bg-violet-600 hover:bg-violet-700 text-white">
              {campaignToEdit ? 'Save Changes' : 'Create Campaign'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
