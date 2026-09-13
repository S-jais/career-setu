const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(body); } catch (e) {}
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: json || body
        });
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function run() {
  console.log('=============================================');
  console.log('🔍 CAREER-SETU BACKEND FEATURE HEALTH CHECK');
  console.log('=============================================\n');

  let token = null;

  // 1. Health
  try {
    const health = await request({
      hostname: 'localhost',
      port: 8080,
      path: '/actuator/health',
      method: 'GET'
    });
    console.log(`[1] Actuator Health: Status ${health.statusCode} -> ${JSON.stringify(health.data)}`);
  } catch (e) {
    console.log(`[1] Actuator Health FAILED: ${e.message}`);
  }

  // 2. Auth Login
  try {
    const login = await request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/v1/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: 'student@careersetu.in',
      password: 'Demo@CareerSetu2024'
    });
    console.log(`[2] Auth Login: Status ${login.statusCode}`);
    if (login.statusCode === 200 && login.data && login.data.accessToken) {
      token = login.data.accessToken;
      console.log(`    Token acquired successfully for ${login.data.user.email}`);
    } else {
      console.log(`    Login response:`, login.data);
    }
  } catch (e) {
    console.log(`[2] Auth Login FAILED: ${e.message}`);
  }

  const authHeaders = token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };

  // 3. Auth Me
  try {
    const me = await request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/v1/auth/me',
      method: 'GET',
      headers: authHeaders
    });
    console.log(`[3] Auth Me (/auth/me): Status ${me.statusCode} -> ${me.data?.email || JSON.stringify(me.data)}`);
  } catch (e) {
    console.log(`[3] Auth Me FAILED: ${e.message}`);
  }

  // 4. Skills
  try {
    const skills = await request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/v1/skills',
      method: 'GET'
    });
    const count = Array.isArray(skills.data) ? skills.data.length : 0;
    console.log(`[4] Skills (/skills): Status ${skills.statusCode} (${count} skills returned)`);
  } catch (e) {
    console.log(`[4] Skills FAILED: ${e.message}`);
  }

  // 5. Student Profile
  try {
    const profile = await request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/v1/students/me',
      method: 'GET',
      headers: authHeaders
    });
    console.log(`[5] Student Profile (/students/me): Status ${profile.statusCode} -> headline: ${profile.data?.headline || JSON.stringify(profile.data)}`);
  } catch (e) {
    console.log(`[5] Student Profile FAILED: ${e.message}`);
  }

  // 6. AI Proxy
  try {
    const ai = await request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/v1/ai/copilot',
      method: 'POST',
      headers: authHeaders
    }, {
      messages: [{ role: 'user', content: 'Hello' }]
    });
    console.log(`[6] AI Proxy (/ai/copilot): Status ${ai.statusCode} -> ${ai.data?.reply ? 'Reply received' : JSON.stringify(ai.data)}`);
  } catch (e) {
    console.log(`[6] AI Proxy FAILED: ${e.message}`);
  }

  // 7. Mentorship
  try {
    const mentors = await request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/v1/mentors',
      method: 'GET',
      headers: authHeaders
    });
    console.log(`[7] Mentors (/mentors): Status ${mentors.statusCode} -> ${Array.isArray(mentors.data) ? `${mentors.data.length} mentors` : JSON.stringify(mentors.data)}`);
  } catch (e) {
    console.log(`[7] Mentors FAILED: ${e.message}`);
  }

  // 8. Campus Events
  try {
    const events = await request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/v1/events',
      method: 'GET',
      headers: authHeaders
    });
    console.log(`[8] Events (/events): Status ${events.statusCode} -> ${Array.isArray(events.data) ? `${events.data.length} events` : JSON.stringify(events.data)}`);
  } catch (e) {
    console.log(`[8] Events FAILED: ${e.message}`);
  }

  // 9. Companies
  try {
    const comp = await request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/v1/companies/primary',
      method: 'GET',
      headers: authHeaders
    });
    console.log(`[9] Companies (/companies/primary): Status ${comp.statusCode} -> ${comp.data?.legalName || JSON.stringify(comp.data)}`);
  } catch (e) {
    console.log(`[9] Companies FAILED: ${e.message}`);
  }

  // 10. Opportunities
  try {
    const opps = await request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/v1/opportunities',
      method: 'GET',
      headers: authHeaders
    });
    console.log(`[10] Opportunities (/opportunities): Status ${opps.statusCode} -> ${Array.isArray(opps.data) ? `${opps.data.length} opportunities` : JSON.stringify(opps.data)}`);
  } catch (e) {
    console.log(`[10] Opportunities FAILED: ${e.message}`);
  }

  // 11. Applications
  try {
    const apps = await request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/v1/applications/me',
      method: 'GET',
      headers: authHeaders
    });
    console.log(`[11] Applications (/applications/me): Status ${apps.statusCode} -> ${Array.isArray(apps.data) ? `${apps.data.length} applications` : JSON.stringify(apps.data)}`);
  } catch (e) {
    console.log(`[11] Applications FAILED: ${e.message}`);
  }

  // 12. Interviews
  try {
    const ints = await request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/v1/interviews/student',
      method: 'GET',
      headers: authHeaders
    });
    console.log(`[12] Interviews (/interviews/student): Status ${ints.statusCode} -> ${Array.isArray(ints.data) ? `${ints.data.length} interviews` : JSON.stringify(ints.data)}`);
  } catch (e) {
    console.log(`[12] Interviews FAILED: ${e.message}`);
  }

  // 13. Messages
  try {
    const msgs = await request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/v1/messages/conversations',
      method: 'GET',
      headers: authHeaders
    });
    console.log(`[13] Messages (/messages/conversations): Status ${msgs.statusCode} -> ${Array.isArray(msgs.data) ? `${msgs.data.length} conversations` : JSON.stringify(msgs.data)}`);
  } catch (e) {
    console.log(`[13] Messages FAILED: ${e.message}`);
  }

  // 14. Notifications
  try {
    const notifs = await request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/v1/notifications/my',
      method: 'GET',
      headers: authHeaders
    });
    console.log(`[14] Notifications (/notifications/my): Status ${notifs.statusCode} -> ${Array.isArray(notifs.data) ? `${notifs.data.length} notifications` : JSON.stringify(notifs.data)}`);
  } catch (e) {
    console.log(`[14] Notifications FAILED: ${e.message}`);
  }

  // 15. Assessments
  try {
    const assess = await request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/v1/assessment/my-submissions',
      method: 'GET',
      headers: authHeaders
    });
    console.log(`[15] Assessments (/assessment/my-submissions): Status ${assess.statusCode} -> ${Array.isArray(assess.data) ? `${assess.data.length} submissions` : JSON.stringify(assess.data)}`);
  } catch (e) {
    console.log(`[15] Assessments FAILED: ${e.message}`);
  }

  // 16. Placement Drives & Institutions
  try {
    const drives = await request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/v1/drives',
      method: 'GET',
      headers: authHeaders
    });
    console.log(`[16] Drives (/drives): Status ${drives.statusCode} -> ${Array.isArray(drives.data) ? `${drives.data.length} drives` : JSON.stringify(drives.data)}`);
  } catch (e) {
    console.log(`[16] Drives FAILED: ${e.message}`);
  }

  console.log('\n--- Testing Interactive Mutations (POST/PATCH) ---');

  // 17. Notifications Read-All
  try {
    const readAll = await request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/v1/notifications/read-all',
      method: 'PATCH',
      headers: authHeaders
    });
    console.log(`[17] Notification Mark-All-Read: Status ${readAll.statusCode} -> ${JSON.stringify(readAll.data)}`);
  } catch (e) {
    console.log(`[17] Notification Mark-All-Read FAILED: ${e.message}`);
  }

  // 18. Send Chat Message
  try {
    const sendMsg = await request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/v1/messages/send',
      method: 'POST',
      headers: authHeaders
    }, {
      recipientId: 'd0000000-0000-0000-0000-000000000002',
      recipientName: 'Recruiter Sarah',
      content: 'Hello, I am very excited about the opportunity!',
      senderRole: 'STUDENT'
    });
    console.log(`[18] Send Chat Message: Status ${sendMsg.statusCode} -> content: "${sendMsg.data?.content || JSON.stringify(sendMsg.data)}"`);
  } catch (e) {
    console.log(`[18] Send Chat Message FAILED: ${e.message}`);
  }

  // 19. Submit Code Assessment
  try {
    const sub = await request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/v1/assessment/submit',
      method: 'POST',
      headers: authHeaders
    }, {
      challengeId: 'system-design',
      challengeTitle: 'System Design & Distributed Cache',
      language: 'java',
      score: 95,
      code: 'public class CacheService { ... }',
      passedTestCases: 5,
      totalTestCases: 5
    });
    console.log(`[19] Submit Assessment: Status ${sub.statusCode} -> Badge: "${sub.data?.badgeTitle || JSON.stringify(sub.data)}" Hash: ${sub.data?.verificationHash?.substring(0, 16)}...`);
  } catch (e) {
    console.log(`[19] Submit Assessment FAILED: ${e.message}`);
  }

  // 20. Institution Stats
  try {
    const stats = await request({
      hostname: 'localhost',
      port: 8080,
      path: '/api/v1/institutions/stats',
      method: 'GET',
      headers: authHeaders
    });
    console.log(`[20] Institution Stats: Status ${stats.statusCode} -> ${JSON.stringify(stats.data)}`);
  } catch (e) {
    console.log(`[20] Institution Stats FAILED: ${e.message}`);
  }

  console.log('\n=============================================');
  console.log('🏁 ALL TESTS COMPLETED');
  console.log('=============================================');
}

run();
