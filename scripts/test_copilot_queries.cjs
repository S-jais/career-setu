const http = require('http');

async function sendQuery(queryText, studentContext = {}) {
  const payload = JSON.stringify({
    messages: [
      { role: 'user', content: queryText }
    ],
    student_context: {
      name: 'Aarav Sharma',
      target_role: 'Full Stack Engineer',
      skills: ['Java', 'SQL', 'Git', 'REST APIs'],
      education_level: 'Undergraduate B.Tech',
      ...studentContext
    }
  });

  return new Promise((resolve, reject) => {
    const req = http.request(
      'http://127.0.0.1:8000/api/v1/ai/copilot',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        },
        timeout: 10000
      },
      (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(data) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data });
          }
        });
      }
    );

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log('--- Testing CareerSetu AI Copilot Chatbot Diversity ---');

  // Test 1: PM Role query
  const q1 = "how do I improve my resume for a PM role";
  console.log(`\nQuery 1: "${q1}"`);
  const res1 = await sendQuery(q1);
  console.log(`Status: ${res1.status}`);
  console.log(`Response Snippet:\n${res1.body?.response?.substring(0, 300)}...`);
  console.log(`Suggested Actions:`, res1.body?.suggested_actions);
  console.log(`Recommended Skills:`, res1.body?.recommended_skills);

  // Test 2: Internship matching query
  const q2 = "what internships match my profile";
  console.log(`\nQuery 2: "${q2}"`);
  const res2 = await sendQuery(q2);
  console.log(`Status: ${res2.status}`);
  console.log(`Response Snippet:\n${res2.body?.response?.substring(0, 300)}...`);
  console.log(`Suggested Actions:`, res2.body?.suggested_actions);
  console.log(`Recommended Skills:`, res2.body?.recommended_skills);

  // Test 3: Backend engineering query
  const q3 = "how do I prepare for a backend engineering role with Java";
  console.log(`\nQuery 3: "${q3}"`);
  const res3 = await sendQuery(q3);
  console.log(`Status: ${res3.status}`);
  console.log(`Response Snippet:\n${res3.body?.response?.substring(0, 300)}...`);
  console.log(`Suggested Actions:`, res3.body?.suggested_actions);
  console.log(`Recommended Skills:`, res3.body?.recommended_skills);

  // Verification assertions
  console.log('\n--- Assertion Checks ---');
  let allPassed = true;

  // Check 1: Res1 must NOT be identical to Res2
  if (res1.body.response === res2.body.response) {
    console.error('FAIL: Response 1 and Response 2 are identical!');
    allPassed = false;
  } else {
    console.log('PASS: Response 1 and Response 2 are topically distinct.');
  }

  // Check 2: Res1 must contain PM guidance
  const r1Lower = res1.body.response.toLowerCase();
  if (r1Lower.includes('product management') || r1Lower.includes('pm') || r1Lower.includes('prd')) {
    console.log('PASS: Response 1 correctly contains Product Management / PM guidance.');
  } else {
    console.error('FAIL: Response 1 does not contain PM guidance.');
    allPassed = false;
  }

  // Check 3: Res2 must contain internship / opportunity guidance
  const r2Lower = res2.body.response.toLowerCase();
  if (r2Lower.includes('internship') || r2Lower.includes('opportunity') || r2Lower.includes('marketplace')) {
    console.log('PASS: Response 2 correctly contains internship / opportunity guidance.');
  } else {
    console.error('FAIL: Response 2 does not contain internship/opportunity guidance.');
    allPassed = false;
  }

  // Check 4: Neither Res1 nor Res2 should have the static 4-pillar Java roadmap if they didn't ask for it
  if (r1Lower.includes('core competencies: strengthen your foundation in java 21+')) {
    console.error('FAIL: Response 1 was hijacked by the static Java roadmap!');
    allPassed = false;
  } else {
    console.log('PASS: Response 1 was NOT hijacked by static Java backend roadmap.');
  }

  if (r2Lower.includes('core competencies: strengthen your foundation in java 21+')) {
    console.error('FAIL: Response 2 was hijacked by the static Java roadmap!');
    allPassed = false;
  } else {
    console.log('PASS: Response 2 was NOT hijacked by static Java backend roadmap.');
  }

  if (allPassed) {
    console.log('\nALL VERIFICATION TESTS PASSED SUCCESSFULLY! The repetitive canned response bug is RESOLVED.');
    process.exit(0);
  } else {
    console.log('\nSOME TESTS FAILED.');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
