import { SkinAnalysis } from "./mockAI";
import { supabase } from "@/integrations/supabase/client";

// Database-backed storage functions
export const saveScan = async (scan: SkinAnalysis): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User must be authenticated to save scans");
  }

  const { error } = await supabase.from("scans").insert({
    user_id: user.id,
    glow_score: scan.glowScore,
    metrics: scan.metrics as any,
    image_url: scan.imageData,
    unlocked: scan.unlocked,
  });

  if (error) {
    console.error("Error saving scan:", error);
    throw error;
  }
};

export const getScanHistory = async (): Promise<SkinAnalysis[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  const { data, error } = await supabase
    .from("scans")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching scan history:", error);
    return [];
  }

  return data.map((scan) => {
    const metrics = scan.metrics as any;
    const metricScores = Object.entries(metrics).map(([key, value]: [string, any]) => ({
      name: key,
      score: value.score,
    }));
    const sortedMetrics = [...metricScores].sort((a, b) => b.score - a.score);
    
    return {
      id: scan.id,
      glowScore: scan.glow_score,
      metrics: metrics,
      imageData: scan.image_url || "",
      unlocked: scan.unlocked,
      timestamp: new Date(scan.created_at).getTime(),
      strength: sortedMetrics[0].name.charAt(0).toUpperCase() + sortedMetrics[0].name.slice(1),
      focusArea: sortedMetrics[sortedMetrics.length - 1].name.charAt(0).toUpperCase() + 
                 sortedMetrics[sortedMetrics.length - 1].name.slice(1),
    };
  });
};

export const getScanById = async (id: string): Promise<SkinAnalysis | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data, error } = await supabase
    .from("scans")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    console.error("Error fetching scan:", error);
    return null;
  }

  const metrics = data.metrics as any;
  const metricScores = Object.entries(metrics).map(([key, value]: [string, any]) => ({
    name: key,
    score: value.score,
  }));
  const sortedMetrics = [...metricScores].sort((a, b) => b.score - a.score);

  return {
    id: data.id,
    glowScore: data.glow_score,
    metrics: metrics,
    imageData: data.image_url || "",
    unlocked: data.unlocked,
    timestamp: new Date(data.created_at).getTime(),
    strength: sortedMetrics[0].name.charAt(0).toUpperCase() + sortedMetrics[0].name.slice(1),
    focusArea: sortedMetrics[sortedMetrics.length - 1].name.charAt(0).toUpperCase() + 
               sortedMetrics[sortedMetrics.length - 1].name.slice(1),
  };
};

export const updateScan = async (id: string, updates: Partial<SkinAnalysis>): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User must be authenticated");
  }

  const dbUpdates: any = {};
  if (updates.glowScore !== undefined) dbUpdates.glow_score = updates.glowScore;
  if (updates.metrics !== undefined) dbUpdates.metrics = updates.metrics;
  if (updates.unlocked !== undefined) dbUpdates.unlocked = updates.unlocked;
  if (updates.imageData !== undefined) dbUpdates.image_url = updates.imageData;

  const { error } = await supabase
    .from("scans")
    .update(dbUpdates)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating scan:", error);
    throw error;
  }
};

export const unlockScan = async (id: string): Promise<void> => {
  await updateScan(id, { unlocked: true });
};

// Temporary scan storage (before save)
const CURRENT_SCAN_KEY = "skinscan_current";

export const setCurrentScan = (scan: SkinAnalysis): void => {
  localStorage.setItem(CURRENT_SCAN_KEY, JSON.stringify(scan));
};

export const getCurrentScan = (): SkinAnalysis | null => {
  const data = localStorage.getItem(CURRENT_SCAN_KEY);
  return data ? JSON.parse(data) : null;
};

export const clearCurrentScan = (): void => {
  localStorage.removeItem(CURRENT_SCAN_KEY);
};
