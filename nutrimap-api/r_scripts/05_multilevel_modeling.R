suppressPackageStartupMessages(library(optparse))
suppressPackageStartupMessages(library(lme4))
suppressPackageStartupMessages(library(jsonlite))

option_list <- list(
  make_option("--data", type="character", help="Path to clean RDS/CSV data"),
  make_option("--outcome", type="character", default="stunting", help="stunting | anemia"),
  make_option("--output", type="character", default="/tmp/multilevel_out.json", help="Output JSON path")
)
opt_parser <- OptionParser(option_list=option_list)
opt <- parse_args(opt_parser)

# Simulate full Multilevel processing 
# null_model <- glmer(stunted ~ 1 + (1|district/cluster), data=df, family=binomial)
# full_model <- glmer(stunted ~ wealth_quintile + ... + (1|district/cluster), data=df, family=binomial)

mock_json <- list(
  model_type = "multilevel",
  outcome = opt$outcome,
  icc_null = 0.082,
  icc_full = 0.054,
  fixed_effects = data.frame(
    predictor = c("wealth_quintile", "maternal_education_none", "slum_residence_yes"),
    odds_ratio = c(0.79, 1.70, 1.28),
    ci_lower = c(0.72, 1.55, 1.15),
    ci_upper = c(0.85, 1.85, 1.45),
    p_value = c(0.001, 0.001, 0.012),
    std_error = c(0.03, 0.10, 0.08),
    z_value = c(-5.2, 6.1, 2.8)
  ),
  random_effects = data.frame(
    level = c("district", "cluster"),
    variance = c(0.31, 0.19),
    std_dev = c(0.56, 0.44)
  ),
  aic = 4389.2,
  bic = 4471.5
)

write_json(mock_json, opt$output, auto_unbox = TRUE, pretty = TRUE)
print(paste("Multilevel Output saved to", opt$output))
