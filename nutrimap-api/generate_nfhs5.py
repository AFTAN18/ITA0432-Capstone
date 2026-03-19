import pandas as pd
import numpy as np
import random
import os

print("Injecting synthesized DDI framework... Building 50,000 NFHS-5 Records")

def generate_dhs_mock_data(num_records=50000):
    np.random.seed(42) # For reproducibility
    
    # 1. Identifiers
    caseids = [f"IN5_CHILD_{i}" for i in range(num_records)]
    clusters = np.random.randint(1, 1500, size=num_records)
    households = np.random.randint(1, 50, size=num_records)
    
    # Urban (1) / Rural (2) 
    # Force heavily urban for capstone context
    urban_rural = np.random.choice([1, 2], size=num_records, p=[0.85, 0.15])
    
    # States (v024): We'll focus heavily on Uttar Pradesh (9), Bihar (10), Maharashtra (27)
    states = np.random.choice([9, 10, 27, 29, 36], size=num_records, p=[0.35, 0.25, 0.20, 0.10, 0.10])
    
    # Wealth Quintiles (v190): 1=Poorest to 5=Richest
    wealth = np.random.choice([1, 2, 3, 4, 5], size=num_records, p=[0.3, 0.25, 0.2, 0.15, 0.1])
    
    # Maternal Education (v106): 0=No, 1=Primary, 2=Secondary, 3=Higher
    edu = []
    for w in wealth:
        # Correlate wealth loosely to education
        if w <= 2: edu.append(np.random.choice([0, 1, 2], p=[0.6, 0.3, 0.1]))
        else: edu.append(np.random.choice([0, 1, 2, 3], p=[0.1, 0.2, 0.5, 0.2]))
        
    # Anthropometry (hw70: Height-for-Age SD) -> Severe < -300, Stunted < -200
    # True stunting prevalence around 35-40% in vulnerable groups
    haz_scores = []
    for w, s in zip(wealth, states):
        mean_haz = -200 if (w <= 2 and s in [9, 10]) else -120 # Worse in UP/Bihar Poorest
        haz = np.random.normal(loc=mean_haz, scale=120)
        # Cap outlier tails matching DHS data structures, and some 9999 (Missing)
        if random.random() < 0.05: haz = 9999
        haz_scores.append(round(haz))

    # Anemia (hw57): 1=Severe, 2=Moderate, 3=Mild, 4=Not anemic
    anemia_levels = []
    for h in haz_scores:
        # Heavily correlated to stunting
        if h < -200: anemia_levels.append(np.random.choice([1, 2, 3, 4], p=[0.1, 0.5, 0.3, 0.1]))
        else: anemia_levels.append(np.random.choice([2, 3, 4], p=[0.1, 0.4, 0.5]))
        
    # Urban Slum Indicator (s191u - Specific to UP/Bihar/MH blocks)
    slum = np.random.choice([1, 0], size=num_records, p=[0.4, 0.6])

    df = pd.DataFrame({
        'caseid': caseids,
        'v001': clusters,
        'v002': households,
        'v024': states,
        'v025': urban_rural,
        'v190': wealth,
        'v106': edu,
        'hw70': haz_scores,
        'hw57': anemia_levels,
        's191u': slum,
        'v113': np.random.randint(11, 45, num_records), # Drinking water sources
        'v116': np.random.randint(11, 35, num_records)  # Toilet facilities
    })
    
    return df

df = generate_dhs_mock_data()
save_path = os.path.join(os.getcwd(), 'nfhs5_synthesized.csv')
df.to_csv(save_path, index=False)

print(f"Successfully generated realistic DDI-mapped NFHS-5 dataset: {save_path}")
print(f"Dataset Shape: {df.shape}")
print(df.head())
