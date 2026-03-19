import subprocess, json, uuid
from pathlib import Path

async def run_r_model(model_type: str, outcome: str, data_path: str) -> dict:
    """Executes a decoupled R analysis script safely as a subprocess"""
    
    script_map = {
        "logistic": "04_logistic_regression.R",
        "multilevel": "05_multilevel_modeling.R",
        "interaction": "06_interaction_effects.R"
    }
    script_name = script_map.get(model_type, "run_full_pipeline.R")
    script = Path(f"r_scripts/{script_name}")

    job_id = str(uuid.uuid4())
    result = subprocess.run(
        ["Rscript", str(script),
         "--outcome", outcome,
         "--data", data_path,
         "--output", f"/tmp/{job_id}_result.json"],
        capture_output=True, text=True, timeout=300
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr)
    with open(f"/tmp/{job_id}_result.json") as f:
        return json.load(f)
