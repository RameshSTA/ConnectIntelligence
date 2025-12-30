import { SegmentType } from './types';

export const SEGMENT_COLORS: Record<string, string> = {
  [SegmentType.WEALTH_BUILDERS]: "#10b981",    // Emerald
  [SegmentType.PRE_RETIREES]: "#3b82f6",       // Blue
  [SegmentType.DISENGAGED_YOUTH]: "#94a3b8",   // Slate
  [SegmentType.HIGH_VALUE_AT_RISK]: "#ef4444", // Red
  [SegmentType.STABLE_SAVERS]: "#f59e0b",      // Amber
};

// Default mapping for clusters if using raw numbers
export const CLUSTER_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];