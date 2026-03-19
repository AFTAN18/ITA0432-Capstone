suppressPackageStartupMessages(library(optparse))

option_list <- list(
  make_option("--data", type="character", help="Path to raw NFHS-5 CSV"),
  make_option("--outcome", type="character", default="both", help="stunting | anemia | both"),
  make_option("--output-dir", type="character", default="./output", help="Directory for JSON results"),
  make_option("--modules", type="character", default="all", help="Comma-separated: preprocess,pca,descriptive,logistic,multilevel,spatial")
)

opt_parser <- OptionParser(option_list=option_list)
opt <- parse_args(opt_parser)
if(is.null(opt$data) && opt$modules != "install") {
   print("--data is required unless running in install dry mode")
   q()
}

print(sprintf("Running Full NutriMap Pipeline against: %s", opt$data))
dir.create(opt$`output-dir`, showWarnings = FALSE)

module_list <- unlist(strsplit(opt$modules, ","))

run_module <- function(script_name, outcome) {
  print(sprintf("--- Starting %s ---", script_name))
  cmd <- sprintf("Rscript r_scripts/%s --data %s --outcome %s --output %s/out_%s.json", 
                 script_name, opt$data, outcome, opt$`output-dir`, tools::file_path_sans_ext(script_name))
  system(cmd)
}

if ("all" %in% module_list || "logistic" %in% module_list) {
  if (opt$outcome %in% c("both", "stunting")) run_module("04_logistic_regression.R", "stunting")
  if (opt$outcome %in% c("both", "anemia")) run_module("04_logistic_regression.R", "anemia")
}

if ("all" %in% module_list || "multilevel" %in% module_list) {
  if (opt$outcome %in% c("both", "stunting")) run_module("05_multilevel_modeling.R", "stunting")
  if (opt$outcome %in% c("both", "anemia")) run_module("05_multilevel_modeling.R", "anemia")
}

print("Pipeline execution completed successfully.")
