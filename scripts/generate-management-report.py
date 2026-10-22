"""Regenerate the independent generic scenario as a coherent dataset."""
import runpy
from pathlib import Path
runpy.run_path(str(Path(__file__).with_name('generate-generic-demo.py')))
