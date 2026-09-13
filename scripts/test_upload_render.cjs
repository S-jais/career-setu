const https = require('https');

function postLogin() {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ email: 'sj6161362@gmail.com', password: 'Demo@CareerSetu2024' });
    const req = https.request('https://careersetu-backend.onrender.com/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function postResumeUpload(token) {
  return new Promise((resolve, reject) => {
    const boundary = '---------------------------974767299852498929531610575';
    const resumeText = 'Aarav Sharma - Full Stack Software Engineer\n\n' +
      'SUMMARY\nExperienced in Java 21, Spring Boot 3, and PostgreSQL microservices.\n\n' +
      'EXPERIENCE\n• Architected RESTful backend APIs reducing latency by 45%.\n' +
      '• Deployed Docker containers across scalable Kubernetes clusters.\n' +
      '• Implemented Redis caching handling 15,000 requests per minute.';

    const filePart =
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file"; filename="aarav_resume.txt"\r\n` +
      `Content-Type: text/plain\r\n\r\n` +
      `${resumeText}\r\n`;

    const rolePart =
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="target_role"\r\n\r\n` +
      `Full Stack Engineer\r\n`;

    const endPart = `--${boundary}--\r\n`;

    const body = Buffer.concat([
      Buffer.from(filePart, 'utf-8'),
      Buffer.from(rolePart, 'utf-8'),
      Buffer.from(endPart, 'utf-8')
    ]);

    const req = https.request('https://careersetu-backend.onrender.com/api/v1/ai/resume/upload', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length,
        'Authorization': `Bearer ${token}`
      }
    }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(d) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: d });
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log('Logging in to live Render backend...');
  const auth = await postLogin();
  console.log('Login successful! Access token acquired.');

  console.log('Uploading resume file to live Render backend...');
  const uploadRes = await postResumeUpload(auth.accessToken);
  console.log('Upload HTTP Status:', uploadRes.status);
  console.log('Upload Response:', JSON.stringify(uploadRes.data, null, 2));

  if (uploadRes.status === 200 && uploadRes.data.analysis) {
    console.log('\nSUCCESS! Resume uploaded and ATS scored successfully on Render.');
  } else {
    console.error('\nFAILED: Status is', uploadRes.status);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
