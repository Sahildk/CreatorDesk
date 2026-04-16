import { Creator, Campaign } from "@/types";

/**
 * 0-100 relevance score
 */
export function computeRelevanceScore(creator: Creator, campaign: Campaign): number {
  let score = 0;

  // Niche Match (40 pts)
  const isPrimaryMatch = campaign.niches.includes(creator.primary_niche);
  const isSecondaryMatch = creator.secondary_niche && campaign.niches.includes(creator.secondary_niche);
  
  if (isPrimaryMatch) score += 40;
  else if (isSecondaryMatch) score += 20;
  else {
    // Check tags partial match
    const tagMatch = creator.tags.some(tag => 
      campaign.niches.some(n => n.toLowerCase() === tag.toLowerCase())
    );
    if (tagMatch) score += 10;
  }

  // Engagement Score (30 pts)
  // Normalize against arbitrary medians for demo purposes
  const platformAverages: Record<string, number> = {
    "Instagram": 3.0,
    "YouTube": 5.0,
    "Twitter": 2.0
  };
  const avg = platformAverages[creator.platform] || 2.0;
  const engRatio = Math.min(creator.engagement_rate / avg, 2.0); // max double
  score += (engRatio / 2.0) * 30;

  // Followers Tier (20 pts)
  // Simple heuristic: higher is slightly better if we don't have campaign scale
  if (creator.followers > 500000) score += 20;
  else if (creator.followers > 100000) score += 15;
  else if (creator.followers > 50000) score += 10;
  else score += 5;

  // Profile Completeness (10 pts)
  score += (creator.profile_score / 100) * 10;

  return Math.round(score);
}

export function computeProfileScore(creator: Partial<Creator>): { score: number, missing: string[] } {
  const missing: string[] = [];
  let score = 100;
  
  const requiredFields = [
    { key: "contact_email", weight: 15 },
    { key: "contact_phone", weight: 15 },
    { key: "secondary_niche", weight: 10 },
    { key: "city", weight: 5 },
  ];

  for (const field of requiredFields) {
    if (!creator[field.key as keyof Creator]) {
      score -= field.weight;
      missing.push(field.key);
    }
  }

  return { score, missing };
}

export function autoTagNiches(creator: Partial<Creator>): string[] {
  const tags = new Set<string>();
  if (creator.platform) tags.add(creator.platform.toLowerCase());
  if (creator.primary_niche) tags.add(creator.primary_niche.toLowerCase());
  if (creator.secondary_niche) tags.add(creator.secondary_niche.toLowerCase());
  if (creator.language) tags.add(creator.language.toLowerCase());
  return Array.from(tags);
}

export function recommendCreators(creators: Creator[], campaign: Campaign, n: number = 5): Creator[] {
  return [...creators]
    .sort((a, b) => computeRelevanceScore(b, campaign) - computeRelevanceScore(a, campaign))
    .slice(0, n);
}
