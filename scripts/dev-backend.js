const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const backendDir = path.join(rootDir, 'backend');
const isWin = process.platform === 'win32';

const mvnwCmd = path.join(backendDir, 'mvnw.cmd');
const mvnwSh = path.join(backendDir, 'mvnw');

let executable;
const baseArgs = ['spring-boot:run', '-Dspring-boot.run.profiles=local'];
let execArgs = [];

if (isWin) {
  executable = 'cmd.exe';
  if (fs.existsSync(mvnwCmd)) {
    execArgs = ['/c', 'mvnw.cmd', ...baseArgs];
  } else {
    // Check known Maven installations if mvn is not in PATH
    const userHome = process.env.USERPROFILE || '';
    const knownCandidates = [
      path.join(userHome, '.maven', 'maven-3.9.15', 'bin', 'mvn.cmd'),
      'C:\\tools\\maven\\apache-maven-3.9.9\\bin\\mvn.cmd',
    ];
    let found = null;
    for (const cand of knownCandidates) {
      if (fs.existsSync(cand)) {
        found = cand;
        break;
      }
    }
    if (found) {
      execArgs = ['/c', `"${found}"`, ...baseArgs];
    } else {
      execArgs = ['/c', 'mvn', ...baseArgs];
    }
  }
} else {
  if (fs.existsSync(mvnwSh)) {
    executable = './mvnw';
    execArgs = baseArgs;
  } else {
    executable = 'mvn';
    execArgs = baseArgs;
  }
}

console.log(`[CareerSetu] Starting Spring Boot Backend in ${backendDir}...`);

const child = spawn(executable, execArgs, {
  cwd: backendDir,
  stdio: 'inherit',
  shell: false,
});

child.on('error', (err) => {
  console.error('[CareerSetu] Failed to start backend:', err);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
