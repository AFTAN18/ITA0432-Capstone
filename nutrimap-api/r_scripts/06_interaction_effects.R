suppressPackageStartupMessages(library(optparse))
suppressPackageStartupMessages(library(jsonlite))

option_list <- list(
  make_option("--data", type="character", help="Path to clean RDS"),
  make_option("--outcome", type="character", default="stunting", help="stunting | anemia"),
  make_option("--output", type="character", default="/tmp/interaction_out.json", help="Path to JSON output")
)
opt_parser <- OptionParser(option_list=option_list)
opt <- parse_args(opt_parser)

mock_json <- list(
  interaction = "slum_x_maternal_education",
  outcome = opt$outcome,
  interaction_or = 1.34,
  ci_lower = 1.12,
  ci_upper = 1.61,
  p_value = 0.002,
  plot_data = data.frame(
    slum = c(0, 0, 1, 1),
    edu = c("none", "primary", "none", "primary"),
    pred_prob = c(0.42, 0.35, 0.61, 0.48)
  )
)

write_json(mock_json, opt$output, auto_unbox = TRUE, pretty = TRUE)
