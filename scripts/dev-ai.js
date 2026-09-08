const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const aiDir = path.join(rootDir, 'ai-service');
const isWin = process.platform === 'win32';

let pythonExec;
const winVenvPython = path.join(aiDir, 'venv', 'Scripts', 'python.exe');
const posixVenvPython = path.join(aiDir, 'venv', 'bin', 'python');

if (isWin && fs.existsSync(winVenvPython)) {
  pythonExec = winVenvPython;
} else if (!isWin && fs.existsSync(posixVenvPython)) {
  pythonExec = posixVenvPython;
} else {
  pythonExec = isWin ? 'python' : 'python3';
}

console.log(`[CareerSetu AI] Starting Python AI Service in ${aiDir}...`);
console.log(`[CareerSetu AI] Using Python executable: ${pythonExec}`);

const args = ['-m', 'uvicorn', 'app.main:app', '--host', '0.0.0.0', '--port', '8000', '--reload'];

const child = spawn(pythonExec, args, {
  cwd: aiDir,
  stdio: 'inherit',
  shell: false,
});

child.on('error', (err) => {
  console.error('[CareerSetu AI] Failed to start AI service:', err);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
