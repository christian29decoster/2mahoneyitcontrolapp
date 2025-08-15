'use client';
import { create } from 'zustand';

type Counts = { unprotected:number; stale:number; quarantined:number };
type State = {
  auditCounts: Counts;
  setAuditCounts: (c: Counts) => void;
  clearAuditCounts: () => void;
};

export const useAuditStore = create<State>((set) => ({
  auditCounts: { unprotected:0, stale:0, quarantined:0 },
  setAuditCounts: (c) => set({ auditCounts: c }),
  clearAuditCounts: () => set({ auditCounts: { unprotected:0, stale:0, quarantined:0 } }),
}));
