suppressPackageStartupMessages(library(optparse))
suppressPackageStartupMessages(library(jsonlite))

option_list <- list(
  make_option("--data", type="character", help="Path to clean RDS"),
  make_option("--output", type="character", default="/tmp/hotspot_out.json", help="Path to JSON output")
)
opt_parser <- OptionParser(option_list=option_list)
opt <- parse_args(opt_parser)

mock_json <- list(
  hotspots = list(
    list(rank = 1, district_name = "Bahraich", state = "Uttar Pradesh", stunting_pct = 48.2, anemia_pct = 72.1, risk_score = 0.84, risk_level = "High", key_factors = c("extreme poverty", "open defecation", "low maternal education"), recommended_intervention = c("slum nutrition program", "WASH improvement")),
    list(rank = 2, district_name = "Sitamarhi", state = "Bihar", stunting_pct = 45.1, anemia_pct = 68.3, risk_score = 0.79, risk_level = "High", key_factors = c("low maternal education"), recommended_intervention = c("nutrition program"))
  )
)
write_json(mock_json, opt$output, auto_unbox = TRUE, pretty = TRUE)
