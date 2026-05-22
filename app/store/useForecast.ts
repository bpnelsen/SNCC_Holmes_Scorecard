"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import seed from "../lib/seed-data.json";
import type {
  AppState,
  Development,
  InputKey,
  BegKey,
  Month,
  Series,
} from "../lib/types";

type Store = AppState & {
  setInput: (devId: string, key: InputKey, month: Month, series: Series, value: number | null) => void;
  setBeg: (devId: string, key: BegKey, series: Series, value: number | null) => void;
  setProfitShare: (devId: string, index: number, percent: number) => void;
  setProfitShareName: (devId: string, index: number, name: string) => void;
  addProfitShare: (devId: string) => void;
  removeProfitShare: (devId: string, index: number) => void;
  setDevelopmentName: (devId: string, name: string) => void;
  resetAll: () => void;
  importState: (s: AppState) => void;
};

const SEED: AppState = { developments: seed as unknown as Development[] };

export const useForecast = create<Store>()(
  persist(
    (set) => ({
      ...SEED,

      setInput: (devId, key, month, series, value) =>
        set((state) => {
          const developments = state.developments.map((d) => {
            if (d.id !== devId) return d;
            const next = { ...d, data: { ...d.data, [key]: { ...d.data[key], [month]: { ...d.data[key][month], [series]: value } } } };
            return next;
          });
          return { developments };
        }),

      setBeg: (devId, key, series, value) =>
        set((state) => {
          const developments = state.developments.map((d) => {
            if (d.id !== devId) return d;
            return {
              ...d,
              data: {
                ...d.data,
                beg: { ...d.data.beg, [key]: { ...d.data.beg[key], [series]: value } },
              },
            };
          });
          return { developments };
        }),

      setProfitShare: (devId, index, percent) =>
        set((state) => ({
          developments: state.developments.map((d) => {
            if (d.id !== devId) return d;
            const shares = d.profitShares.map((s, i) => (i === index ? { ...s, percent } : s));
            return { ...d, profitShares: shares };
          }),
        })),

      setProfitShareName: (devId, index, name) =>
        set((state) => ({
          developments: state.developments.map((d) => {
            if (d.id !== devId) return d;
            const shares = d.profitShares.map((s, i) => (i === index ? { ...s, name } : s));
            return { ...d, profitShares: shares };
          }),
        })),

      addProfitShare: (devId) =>
        set((state) => ({
          developments: state.developments.map((d) =>
            d.id === devId
              ? { ...d, profitShares: [...d.profitShares, { name: "New Partner", percent: 0 }] }
              : d
          ),
        })),

      removeProfitShare: (devId, index) =>
        set((state) => ({
          developments: state.developments.map((d) =>
            d.id === devId
              ? { ...d, profitShares: d.profitShares.filter((_, i) => i !== index) }
              : d
          ),
        })),

      setDevelopmentName: (devId, name) =>
        set((state) => ({
          developments: state.developments.map((d) => (d.id === devId ? { ...d, name } : d)),
        })),

      resetAll: () => set(SEED),

      importState: (s) => set(s),
    }),
    {
      name: "holmes-forecast-2026",
      version: 1,
    }
  )
);
