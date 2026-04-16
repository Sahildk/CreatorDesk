import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { parseCsv, downloadCsv } from '@/lib/csvUtils';
import { Creator } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload, Link as LinkIcon, FileSpreadsheet } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SheetsSync({ open, onOpenChange }: Props) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { setCreators, creators, campaigns, activeCampaignId, classifications } = useAppStore();
  const { toast } = useToast();

  const handleImport = async () => {
    if (!url) return;
    
    // Quick validation for Google Sheets pubic CSV
    if (!url.includes('docs.google.com/spreadsheets') || !url.includes('pub?output=csv')) {
      toast({
        title: "Invalid URL",
        description: "Please provide a valid Google Sheets 'Publish to web' CSV link.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch sheet");
      
      const csvText = await response.text();
      const parsed = parseCsv(csvText);
      
      // Map to internal Creator schema
      const mappedCreators: Creator[] = parsed.map((row: any) => ({
        id: row.Creator_ID || crypto.randomUUID(),
        name: row.Name || 'Unknown Creator',
        platform: row.Platform || 'Instagram',
        primary_niche: row.Primary_Niche || 'General',
        secondary_niche: row.Secondary_Niche || null,
        followers: parseInt(row.Followers) || 0,
        engagement_rate: parseFloat(row['Engagement_Rate_%']) || 0,
        avg_views: parseInt(row.Avg_Views) || 0,
        contact_email: row.Contact_Email || null,
        contact_phone: row.Contact_Number ? `+91-${row.Contact_Number}` : null,
        city: row.City || 'Unknown',
        language: row.Language || 'English',
        cost_per_post: parseInt(row.Cost_Per_Post) || 0,
        tags: [row.Platform, row.Primary_Niche, row.Secondary_Niche].filter(Boolean).map((t: string) => t.toLowerCase()),
        profile_score: 100, // Would be computed normally
        missing_fields: []
      }));

      // Merge with existing
      const newData = [...creators];
      mappedCreators.forEach(mc => {
        const idx = newData.findIndex(c => c.id === mc.id);
        if (idx >= 0) newData[idx] = Object.assign(newData[idx], mc);
        else newData.push(mc);
      });
      
      setCreators(newData);
      
      toast({
        title: "Import Successful",
        description: `Imported ${mappedCreators.length} creators from Google Sheets.`,
      });
      onOpenChange(false);
    } catch (e) {
      toast({
        title: "Import Failed",
        description: "Could not fetch or parse the Google Sheet. Make sure it's published to the web as CSV.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!activeCampaignId) {
       toast({ title: "No active campaign", variant: "destructive" });
       return;
    }
    
    const activeCamp = campaigns.find(c => c.id === activeCampaignId);
    const campaignClassifications = classifications[activeCampaignId] || {};
    
    const shortlistIds = Object.entries(campaignClassifications)
      .filter(([_, status]) => status === 'shortlisted')
      .map(([id]) => id);
      
    if (shortlistIds.length === 0) {
      toast({ title: "Shortlist is empty", description: "Add creators to shortlist first." });
      return;
    }

    const shortlistCreators = creators.filter(c => shortlistIds.includes(c.id));
    
    const exportData = shortlistCreators.map(c => ({
      Campaign: activeCamp?.name,
      Creator_ID: c.id,
      Name: c.name,
      Platform: c.platform,
      Primary_Niche: c.primary_niche,
      Followers: c.followers,
      Contact_Email: c.contact_email,
      Cost: c.cost_per_post
    }));

    downloadCsv(exportData, `shortlist-${activeCamp?.code}.csv`);
    
    toast({
      title: "Export Successful",
      description: "CSV downloaded. You can now import it to Google Sheets.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><FileSpreadsheet size={20} className="text-green-500" /> Google Sheets Sync</DialogTitle>
          <DialogDescription>
            Import your existing creator database or export your campaign shortlists.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="import" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import">Import Creators</TabsTrigger>
            <TabsTrigger value="export">Export Shortlist</TabsTrigger>
          </TabsList>
          
          <TabsContent value="import" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Published CSV Link</Label>
              <div className="flex bg-black/20 rounded-md border border-white/10 items-center px-3">
                <LinkIcon size={16} className="text-muted-foreground mr-2 shrink-0" />
                <Input 
                  value={url} 
                  onChange={e => setUrl(e.target.value)} 
                  placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv" 
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none"
                />
              </div>
              <p className="text-xs text-muted-foreground">Go to File &gt; Share &gt; Publish to web. Choose "Entire Document" and "CSV".</p>
            </div>
            <Button onClick={handleImport} disabled={loading || !url} className="w-full bg-green-600 hover:bg-green-700">
              {loading ? "Importing..." : <><Download size={16} className="mr-2" /> Sync from Sheets</>}
            </Button>
          </TabsContent>
          
          <TabsContent value="export" className="space-y-4 py-4 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
              <Upload size={24} className="text-green-500" />
            </div>
            <div className="space-y-1">
              <h4 className="font-medium">Export Current Campaign</h4>
              <p className="text-sm text-muted-foreground">Download a clean CSV of shortlisted creators.</p>
            </div>
            <Button onClick={handleExport} className="w-full bg-green-600 hover:bg-green-700 mt-2">
              <Download size={16} className="mr-2" /> Download CSV
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
