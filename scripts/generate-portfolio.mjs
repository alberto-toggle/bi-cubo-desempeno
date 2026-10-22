// All generic fixtures are generated together to keep totals and indicators consistent.
import { execFileSync } from 'node:child_process';
execFileSync('python3', [new URL('./generate-generic-demo.py', import.meta.url).pathname], { stdio: 'inherit' });
