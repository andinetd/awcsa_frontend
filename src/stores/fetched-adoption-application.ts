import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FetchedAdoptionApplication } from "@/schemas/application/fetchedAdoptionApplicationSchema";

interface FetchedAdoptionApplicationState {
  application: FetchedAdoptionApplication | null;
  loading: boolean;
  error: string | null;
  setApplication: (app: FetchedAdoptionApplication | null) => void;
  clear: () => void;
  setLoading: (v: boolean) => void;
  setError: (err: string | null) => void;
}

export const useFetchedAdoptionApplicationStore =
  create<FetchedAdoptionApplicationState>()(
    persist(
      (set) => ({
        application: null,
        loading: false,
        error: null,
        setApplication: (app: FetchedAdoptionApplication | null) =>
          set({ application: app, error: null }),
        clear: () => set({ application: null, error: null }),
        setLoading: (v: boolean) => set({ loading: v }),
        setError: (err: string | null) => set({ error: err }),
      }),
      { name: "fetched-adoption-application" }
    )
  );
