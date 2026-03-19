packages <- c(
  "data.table", "dplyr", "tidyr", "readr",       # Data wrangling
  "survey", "svyVGAM",                           # Complex survey analysis
  "lme4", "lmerTest", "MuMIn",                   # Multilevel modeling
  "sf", "spdep", "tmap",                         # Spatial analysis
  "ggplot2", "ggeffects", "patchwork",           # Visualization
  "jsonlite",                                    # JSON output
  "performance", "see",                          # Model diagnostics
  "optparse"                                     # CLI argument parsing
)

install.packages(packages, repos="https://cran.r-project.org")
print("R Dependencies successfully installed.")
