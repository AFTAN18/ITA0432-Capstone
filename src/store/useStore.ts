import { create } from 'zustand';

export type Outcome = 'stunting' | 'anemia' | 'both';
export type EducationLevel = 'None' | 'Primary' | 'Secondary' | 'Higher';

export interface FilterState {
  states: string[];
  districts: string[];
  outcome: Outcome;
  wealthQuintile: [number, number]; // 1-5 range
  maternalEducation: EducationLevel | 'All';
  sanitationAccess: boolean | null;
  slumResidence: boolean | null;
  setStates: (states: string[]) => void;
  setDistricts: (districts: string[]) => void;
  setOutcome: (outcome: Outcome) => void;
  setWealthQuintile: (range: [number, number]) => void;
  setMaternalEducation: (level: EducationLevel | 'All') => void;
  setSanitationAccess: (access: boolean | null) => void;
  setSlumResidence: (slum: boolean | null) => void;
  resetFilters: () => void;
}

const initialFilters = {
  states: [],
  districts: [],
  outcome: 'stunting' as Outcome,
  wealthQuintile: [1, 5] as [number, number],
  maternalEducation: 'All' as EducationLevel | 'All',
  sanitationAccess: null,
  slumResidence: null,
};

export const useStore = create<FilterState>((set) => ({
  ...initialFilters,
  setStates: (states) => set({ states }),
  setDistricts: (districts) => set({ districts }),
  setOutcome: (outcome) => set({ outcome }),
  setWealthQuintile: (wealthQuintile) => set({ wealthQuintile }),
  setMaternalEducation: (maternalEducation) => set({ maternalEducation }),
  setSanitationAccess: (sanitationAccess) => set({ sanitationAccess }),
  setSlumResidence: (slumResidence) => set({ slumResidence }),
  resetFilters: () => set(initialFilters),
}));

if (typeof window !== 'undefined') {
  // Try to load initial from URL
  const params = new URLSearchParams(window.location.search);
  const pOutcome = params.get('outcome');
  if (pOutcome) {
    useStore.setState({ outcome: pOutcome as Outcome });
  }

  // Subscribe to changes to update URL
  useStore.subscribe((state) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('outcome', state.outcome);
    
    // Only set if they differ from initial state to keep URL clean, but for brevity setting all:
    if (state.states.length > 0) searchParams.set('states', state.states.join(','));
    else searchParams.delete('states');
    
    // Push state
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.replaceState({}, '', newUrl);
  });
}
