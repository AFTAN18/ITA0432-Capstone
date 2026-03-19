suppressPackageStartupMessages(library(optparse))
suppressPackageStartupMessages(library(jsonlite))

option_list <- list(
  make_option("--data", type="character", help="Path to clean RDS"),
  make_option("--outcome", type="character", default="both", help="stunting | anemia | both"),
  make_option("--output", type="character", default="/tmp/spatial_out.json", help="Path to JSON output")
)
opt_parser <- OptionParser(option_list=option_list)
opt <- parse_args(opt_parser)

mock_json <- list(
  global_morans_i = 0.38,
  z_score = 12.4,
  p_value = 0.0001,
  interpretation = "Strong positive spatial autocorrelation",
  district_clusters = data.frame(
    district_code = c("UP01", "BR01", "MH01", "KA01", "OR01"),
    cluster_type = c("HH", "HH", "HL", "LL", "LH"),
    local_i = c(0.62, 0.55, 0.12, -0.45, -0.22)
  )
)

write_json(mock_json, opt$output, auto_unbox = TRUE, pretty = TRUE)
