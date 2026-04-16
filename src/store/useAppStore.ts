import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Creator, Campaign, CreatorStatus, FilterState } from '@/types';

interface AppStore {
  // Data
  creators: Creator[];
  setCreators: (creators: Creator[]) => void;
  
  // Campaigns
  campaigns: Campaign[];
  activeCampaignId: string | null;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (campaign: Campaign) => void;
  deleteCampaign: (id: string) => void;
  setActiveCampaign: (id: string) => void;
  
  // Classifications: campaignId -> { creatorId -> status }
  classifications: Record<string, Record<string, CreatorStatus>>;
  setCreatorStatus: (campaignId: string, creatorId: string, status: CreatorStatus) => void;
  
  // Filters (ephemeral, not persisted)
  filters: FilterState;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
}

const initialFilters: FilterState = {
  platforms: [],
  niches: [],
  minFollowers: 0,
  maxCost: 1000000,
  language: '',
  city: '',
  aiPicksOnly: false,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      creators: [],
      setCreators: (creators) => set({ creators }),
      
      campaigns: [],
      activeCampaignId: null,
      addCampaign: (campaign) => set((state) => ({ 
        campaigns: [...state.campaigns, campaign],
        activeCampaignId: campaign.id 
      })),
      updateCampaign: (campaign) => set((state) => ({
        campaigns: state.campaigns.map(c => c.id === campaign.id ? campaign : c)
      })),
      deleteCampaign: (id) => set((state) => {
        const newCampaigns = state.campaigns.filter(c => c.id !== id);
        return {
          campaigns: newCampaigns,
          activeCampaignId: state.activeCampaignId === id ? (newCampaigns[0]?.id || null) : state.activeCampaignId,
          classifications: Object.fromEntries(Object.entries(state.classifications).filter(([k]) => k !== id))
        };
      }),
      setActiveCampaign: (id) => set({ activeCampaignId: id }),
      
      classifications: {},
      setCreatorStatus: (campaignId, creatorId, status) => set((state) => ({
        classifications: {
          ...state.classifications,
          [campaignId]: {
            ...state.classifications[campaignId],
            [creatorId]: status
          }
        }
      })),
      
      filters: initialFilters,
      setFilter: (key, value) => set((state) => ({
        filters: { ...state.filters, [key]: value }
      })),
      resetFilters: () => set({ filters: initialFilters }),
    }),
    {
      name: 'creatordesk-storage',
      // We don't persist filters
      partialize: (state) => ({ 
        campaigns: state.campaigns, 
        activeCampaignId: state.activeCampaignId,
        classifications: state.classifications 
      }),
    }
  )
);
