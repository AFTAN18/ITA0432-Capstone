suppressPackageStartupMessages(library(optparse))

option_list <- list(
  make_option("--data", type="character", help="Path to raw NFHS-5 CSV"),
  make_option("--output", type="character", default="/tmp/out.rds", help="Path to cleaned RDS output")
)
opt_parser <- OptionParser(option_list=option_list)
opt <- parse_args(opt_parser)

print("Simulating Data Preprocessing: Cleaning CSV, transforming variables, generating haz/waz scores, applying missing data imputation...")
print(sprintf("Writing cleaned structure to %s", opt$output))
# Actual implementation: df <- read.csv(opt$data) | df_clean <- ... | saveRDS(df_clean, opt$output)
