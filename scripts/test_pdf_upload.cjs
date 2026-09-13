const https = require('https');

async function testPdf() {
  const loginPayload = JSON.stringify({ email: 'sj6161362@gmail.com', password: 'Demo@CareerSetu2024' });
  const auth = await new Promise((resolve, reject) => {
    const req = https.request('https://careersetu-backend.onrender.com/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(loginPayload) }
    }, r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => resolve(JSON.parse(d)));
    });
    req.on('error', reject);
    req.write(loginPayload);
    req.end();
  });

  const boundary = '----WebKitFormBoundaryXYZ123456';
  const pdfHeader = '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Contents 4 0 R>>endobj 4 0 obj<</Length 120>>stream\nBT /F1 12 Tf 100 700 Td (Siddhartha Jaiswal - Senior Full Stack Engineer. Implemented microservices with Java, Spring Boot, React, Docker, and PostgreSQL. Improved query latency by 40%.) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \ntrailer<</Size 5/Root 1 0 R>>\nstartxref\n350\n%%EOF';

  const filePart = Buffer.from(
    '--' + boundary + '\r\n' +
    'Content-Disposition: form-data; name="file"; filename="sample_resume.pdf"\r\n' +
    'Content-Type: application/pdf\r\n\r\n' +
    pdfHeader + '\r\n'
  );
  const rolePart = Buffer.from(
    '--' + boundary + '\r\n' +
    'Content-Disposition: form-data; name="target_role"\r\n\r\n' +
    'Full Stack Engineer\r\n'
  );
  const endPart = Buffer.from('--' + boundary + '--\r\n');

  const fullBody = Buffer.concat([filePart, rolePart, endPart]);

  const uploadRes = await new Promise((resolve, reject) => {
    const req = https.request('https://careersetu-backend.onrender.com/api/v1/ai/resume/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data; boundary=' + boundary,
        'Content-Length': fullBody.length,
        'Authorization': 'Bearer ' + auth.accessToken
      }
    }, r => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => resolve({ status: r.statusCode, data: JSON.parse(d) }));
    });
    req.on('error', reject);
    req.write(fullBody);
    req.end();
  });

  console.log('PDF Upload HTTP Status:', uploadRes.status);
  console.log('PDF Analysis result:', JSON.stringify(uploadRes.data.analysis, null, 2));
}

testPdf().catch(console.error);
