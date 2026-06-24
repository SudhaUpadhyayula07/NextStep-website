import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { careerCategories, colleges, engineeringColleges, exams } from './data.js';
import { 
  handleCareerComparison, 
  handleResumeTips, 
  handleSkillGap, 
  handleSalaryInsights, 
  handlePersonalityGuidance 
} from './careerGuidance.js';

const PORT = Number(process.env.PORT || 4000);
const ROOT_DIR = join(fileURLToPath(new URL('..', import.meta.url)));
const DATA_ROOT = process.env.VERCEL ? join(process.env.TMPDIR || '/tmp', 'nextstep') : ROOT_DIR;
const DB_DIR = join(DATA_ROOT, 'backend', '.data');
const DB_FILE = join(DB_DIR, 'db.json');
const SCHOLARSHIPS_FILE = join(ROOT_DIR, 'data', 'india-scholarships.json');

// Supabase initialization
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
let supabase = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

const defaultDb = {
  users: [],
  sessions: {},
  savedColleges: {},
  assessmentAnswers: [],
  chatSessions: {}
};

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization'
  });
  res.end(JSON.stringify(data));
}

function sendError(res, status, message) {
  sendJson(res, status, { error: message });
}

function hashPassword(password) {
  return createHash('sha256').update(String(password)).digest('hex');
}

async function readDb() {
  if (!existsSync(DB_FILE)) {
    await mkdir(DB_DIR, { recursive: true });
    await writeFile(DB_FILE, JSON.stringify(defaultDb, null, 2));
  }
  const raw = await readFile(DB_FILE, 'utf8');
  return JSON.parse(raw);
}

async function writeDb(db) {
  await mkdir(DB_DIR, { recursive: true });
  await writeFile(DB_FILE, JSON.stringify(db, null, 2));
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return {};
  }
}

function getToken(req) {
  const auth = req.headers.authorization || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : '';
}

async function getCurrentUser(req) {
  const token = getToken(req);
  if (!token) return null;
  
  if (supabase) {
    // Look up user in Supabase
    const db = await readDb();
    const userId = db.sessions[token];
    if (!userId) return null;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    return error ? null : data;
  } else {
    // Fallback to JSON if Supabase not configured
    const db = await readDb();
    const userId = db.sessions[token];
    return db.users.find(user => user.id === userId) || null;
  }
}

function publicUser(user) {
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

function getChatSessionId(body) {
  return String(body.sessionId || '').trim();
}

function createChatSession(db, sessionId) {
  if (!db.chatSessions) db.chatSessions = {};
  const id = sessionId || randomUUID();
  if (!db.chatSessions[id]) {
    db.chatSessions[id] = {
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profile: {},
      messages: []
    };
  }
  return db.chatSessions[id];
}

function updateChatSession(db, session) {
  session.updatedAt = new Date().toISOString();
  db.chatSessions = db.chatSessions || {};
  db.chatSessions[session.id] = session;
  return session;
}

function detectStream(lower) {
  const streamMap = [
    { value: 'Science', regex: /\b(science|pcm|pcb|biology|physics|chemistry|maths|mathematics)\b/ },
    { value: 'Commerce', regex: /\b(commerce|accounting|business|economics|finance|banking|tax|ca|cma)\b/ },
    { value: 'Arts', regex: /\b(arts|humanities|design|media|journalism|literature|theatre|music|dance|fine arts|creative)\b/ }
  ];

  for (const item of streamMap) {
    if (item.regex.test(lower)) return item.value;
  }
  return '';
}

function detectGoal(lower) {
  const categories = [
    { id: 'engineering', regex: /\b(engineer|engineering|software|coding|computer|data scientist|data science|ai|ml|cyber security|cloud|devops|robotics)\b/ },
    { id: 'medical', regex: /\b(doctor|medical|nurse|pharmacy|physiotherapist|mbbs|ne(e|t)|hospital|clinical)\b/ },
    { id: 'arts', regex: /\b(design|artist|creative|media|journalist|writer|performer|actor|musician|animator|photography|fashion)\b/ },
    { id: 'commerce', regex: /\b(finance|accountant|bank|ca|cma|investment|audit|economics|business analyst|management consultant|marketing)\b/ },
    { id: 'government', regex: /\b(ias|ips|upsc|ssc|railway|defence|civil service|government|public sector|police)\b/ },
    { id: 'entrepreneurship', regex: /\b(startup|entrepreneur|founder|business owner|venture|e-commerce|consultant)\b/ }
  ];

  for (const category of categories) {
    if (category.regex.test(lower)) {
      return category.id;
    }
  }
  return '';
}

function detectStage(lower) {
  if (/\b(class\s?12|12th|senior year|second year of high school|higher secondary)\b/.test(lower)) return 'Grade 12 / Higher Secondary';
  if (/\b(class\s?11|11th|first year of high school)\b/.test(lower)) return 'Grade 11';
  if (/\b(college|undergraduate|bachelor|graduation|engineering college|university)\b/.test(lower)) return 'College / Undergraduate';
  return '';
}

function mergeChatProfile(profile, lower) {
  const stream = detectStream(lower);
  const category = detectGoal(lower);
  const stage = detectStage(lower);

  return {
    stream: profile.stream || stream || profile.stream,
    category: profile.category || category || profile.category,
    stage: profile.stage || stage || profile.stage,
    goal: profile.goal || (category ? lower : profile.goal)
  };
}

function buildMissingQuestions(profile) {
  const questions = [];
  if (!profile.stream) {
    questions.push('What is your current stream or focus? (Science / Commerce / Arts / Humanities)');
  }
  if (!profile.category) {
    questions.push('Which career field are you interested in? (example: engineering, medical, design, finance, government, startup)');
  }
  return questions;
}

function getIntent(lower) {
  return {
    wantsExams: /(exam|jee|neet|cuet|cat|clat|mba|gmat|gate)/i.test(lower),
    wantsScholarships: /(scholarship|stipend|fund|grant|fellowship)/i.test(lower),
    wantsColleges: /(college|colleges|admission|university|campus|institute)/i.test(lower),
    wantsRoadmap: /(roadmap|plan|steps|next|prepare|path)/i.test(lower),
    wantsComparison: /(compare|comparison|vs|versus|which is better|difference|pros and cons)/i.test(lower),
    wantsResumeTips: /(resume|cv|cover letter|interview|job application|linkedin|portfolio)/i.test(lower),
    wantsSkillGap: /(skill|gap|learn|training|course|certification|upskill|development)/i.test(lower),
    wantsSalary: /(salary|pay|compensation|income|earning|package|ctc|job market|demand)/i.test(lower),
    wantsPersonality: /(personality|aptitude|assessment|test|suitable|fit|match|personality type)/i.test(lower)
  };
}

function chooseCareerCategory(profile, lower) {
  if (profile.category) {
    const category = getCategoryById(profile.category);
    if (category) return category;
  }

  const lowerCategory = detectGoal(lower);
  if (lowerCategory) {
    const category = getCategoryById(lowerCategory);
    if (category) return category;
  }

  if (profile.stream) {
    if (profile.stream === 'Science') return getCategoryById('engineering') || careerCategories[0];
    if (profile.stream === 'Commerce') return getCategoryById('commerce');
    if (profile.stream === 'Arts') return getCategoryById('arts');
  }

  return careerCategories[0];
}

function formatList(items, maxItems = 3) {
  return items.slice(0, maxItems).join(', ');
}

function buildGuidanceReply(session, userMessage, intent) {
  const chosen = chooseCareerCategory(session.profile, userMessage.toLowerCase());
  const topPaths = chosen.paths.slice(0, 5);
  const examMap = {
    engineering: ['JEE Main', 'JEE Advanced', 'BITSAT'],
    medical: ['NEET UG'],
    arts: ['CUET UG', 'CLAT'],
    commerce: ['CAT'],
    government: ['UPSC', 'SSC'],
    entrepreneurship: ['CUET UG', 'CAT']
  };

  const exams = examMap[chosen.id] || [];
  const scholarshipsTips = [
    'National Scholarship Portal (NSP) — check eligibility + documents',
    'AICTE Pragati Scholarship (women in technical education)',
    'INSPIRE Scholarship for science students'
  ];

  let reply = `Based on your profile, you are focusing on **${chosen.name}**.`;
  if (session.profile.stream) {
    reply += ` You are currently in ${session.profile.stream}.`;
  }
  if (session.profile.stage) {
    reply += ` You are at ${session.profile.stage}.`;
  }
  if (session.profile.goal) {
    reply += ` Your expressed interest is: ${session.profile.goal}.`;
  }

  reply += `\n\nHere are strong career options to explore: ${formatList(topPaths, 4)}.`;

  if (intent.wantsExams || session.profile.category) {
    reply += `\n\nRelevant exams to plan for: ${exams.join(', ')}.`;
  }

  if (intent.wantsScholarships) {
    reply += `\n\nScholarship suggestions: ${scholarshipsTips.join('; ')}.`;
  }

  reply += `\n\nNext, tell me whether you want a 30/90-day roadmap, college shortlists, or resume and skill development guidance.`;

  return { reply, suggested: { category: chosen.id, career: chosen.name, topPaths, exams, scholarships: scholarshipsTips } };
}

function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

function getCategoryById(id) {
  return careerCategories.find(category => category.id === normalizeText(id));
}

function getFilteredColleges(searchParams) {
  const state = normalizeText(searchParams.get('state'));
  const city = normalizeText(searchParams.get('city'));
  const type = normalizeText(searchParams.get('type'));
  const q = normalizeText(searchParams.get('q'));

  return colleges.filter(college => {
    const haystack = `${college.name} ${college.city} ${college.state} ${college.type}`.toLowerCase();
    return (!state || college.state.toLowerCase() === state)
      && (!city || college.city.toLowerCase().includes(city))
      && (!type || college.type.toLowerCase().includes(type))
      && (!q || haystack.includes(q));
  });
}

async function readScholarships() {
  try {
    const raw = await readFile(SCHOLARSHIPS_FILE, 'utf8');
    return JSON.parse(raw.replace(/^\uFEFF/, ''));
  } catch {
    return [];
  }
}

function getFilteredScholarships(items, searchParams) {
  const q = normalizeText(searchParams.get('q'));
  const level = normalizeText(searchParams.get('level'));
  const type = normalizeText(searchParams.get('type'));
  const minAmount = Number(searchParams.get('minAmount') || 0);

  return items.filter(item => {
    const haystack = [
      item.name,
      item.fullName,
      item.type,
      item.provider,
      item.beneficiary,
      item.level,
      item.amount,
      item.eligibility
    ].join(' ').toLowerCase();

    return (!q || haystack.includes(q))
      && (!level || normalizeText(item.level).includes(level))
      && (!type || normalizeText(item.type || item.sheet) === type)
      && (!minAmount || Number(item.amountValue || 0) >= minAmount);
  });
}

async function handleApi(req, res, url) {
  const method = req.method;
  const path = url.pathname;

  if (method === 'OPTIONS') {
    return sendJson(res, 200, { ok: true });
  }

  if (method === 'GET' && path === '/api/health') {
    return sendJson(res, 200, { ok: true, app: 'NextStep API' });
  }

  if (method === 'POST' && path === '/api/auth/signup') {
    const body = await readBody(req);
    const name = String(body.name || '').trim();
    const email = normalizeText(body.email);
    const phone = String(body.phone || '').trim();
    const password = String(body.password || '');
    if (!name || !email || password.length < 6) {
      return sendError(res, 400, 'Name, valid email, and 6+ character password are required.');
    }

    try {
      if (supabase) {
        // Check if user already exists in Supabase
        const { data: existing } = await supabase
          .from('users')
          .select('id')
          .or(`email.eq.${email},phone.eq.${phone}`)
          .limit(1);
        
        if (existing && existing.length > 0) {
          return sendError(res, 409, 'A user with this email or phone already exists.');
        }

        // Create user via Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email,
          password,
          user_metadata: { name, phone }
        });

        if (authError) {
          return sendError(res, 409, authError.message || 'Failed to create user.');
        }

        const userId = authData.user.id;

        // Store user profile in users table
        const { error: dbError } = await supabase
          .from('users')
          .insert({
            id: userId,
            name,
            email,
            phone,
            plan: 'Free',
            created_at: new Date().toISOString()
          });

        if (dbError) {
          return sendError(res, 500, 'Failed to save user profile.');
        }

        // Create session token
        const token = randomUUID();
        const db = await readDb();
        db.sessions[token] = userId;
        await writeDb(db);

        const user = { id: userId, name, email, phone, plan: 'Free', createdAt: new Date().toISOString() };
        return sendJson(res, 201, { token, user });
      } else {
        // Fallback: JSON-based auth (for local dev without Supabase)
        const db = await readDb();
        if (db.users.some(user => user.email === email || (phone && user.phone === phone))) {
          return sendError(res, 409, 'A user with this email or phone already exists.');
        }

        const user = {
          id: randomUUID(),
          name,
          email,
          phone,
          plan: 'Free',
          createdAt: new Date().toISOString(),
          passwordHash: hashPassword(password)
        };
        const token = randomUUID();
        db.users.push(user);
        db.sessions[token] = user.id;
        await writeDb(db);
        return sendJson(res, 201, { token, user: publicUser(user) });
      }
    } catch (error) {
      return sendError(res, 500, 'Signup failed: ' + error.message);
    }
  }

  if (method === 'POST' && path === '/api/auth/login') {
    const body = await readBody(req);
    const email = normalizeText(body.email);
    const phone = String(body.phone || '').trim();
    const password = String(body.password || '');

    try {
      if (supabase) {
        // Authenticate via Supabase
        const { data: authData, error: authError } = await supabase.auth.admin.getUserByEmail(email);
        
        if (authError || !authData?.user) {
          // Try phone lookup
          const { data: phoneData } = await supabase
            .from('users')
            .select('id')
            .eq('phone', phone)
            .single();
          
          if (!phoneData) {
            return sendError(res, 401, 'Invalid email/phone or password.');
          }

          const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('id', phoneData.id)
            .single();

          // Verify password by attempting auth
          const { error: verifyError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password
          });

          if (verifyError) {
            return sendError(res, 401, 'Invalid email/phone or password.');
          }

          const token = randomUUID();
          const db = await readDb();
          db.sessions[token] = user.id;
          await writeDb(db);
          return sendJson(res, 200, { token, user });
        }

        // Verify password
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          return sendError(res, 401, 'Invalid email/phone or password.');
        }

        // Get user profile
        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        const token = randomUUID();
        const db = await readDb();
        db.sessions[token] = authData.user.id;
        await writeDb(db);
        return sendJson(res, 200, { token, user });
      } else {
        // Fallback: JSON-based auth
        const passwordHash = hashPassword(password || '');
        const db = await readDb();
        const user = db.users.find(item => (email && item.email === email || phone && item.phone === phone) && item.passwordHash === passwordHash);
        if (!user) return sendError(res, 401, 'Invalid email/phone or password.');
        const token = randomUUID();
        db.sessions[token] = user.id;
        await writeDb(db);
        return sendJson(res, 200, { token, user: publicUser(user) });
      }
    } catch (error) {
      return sendError(res, 500, 'Login failed: ' + error.message);
    }
  }

  if (method === 'GET' && path === '/api/me') {
    const user = await getCurrentUser(req);
    if (!user) return sendError(res, 401, 'Login required.');
    return sendJson(res, 200, { user: publicUser(user) });
  }

  if (method === 'GET' && path === '/api/careers/categories') {
    const summary = careerCategories.map(({ paths, ...category }) => ({
      ...category,
      pathCount: paths.length
    }));
    return sendJson(res, 200, { categories: summary });
  }

  if (method === 'GET' && path.startsWith('/api/careers/categories/')) {
    const id = path.split('/').pop();
    const category = getCategoryById(id);
    if (!category) return sendError(res, 404, 'Career category not found.');
    return sendJson(res, 200, {
      category,
      engineeringColleges: category.id === 'engineering' ? engineeringColleges : []
    });
  }

  if (method === 'GET' && path === '/api/engineering/colleges') {
    return sendJson(res, 200, {
      count: engineeringColleges.length,
      colleges: engineeringColleges
    });
  }

  if (method === 'GET' && path === '/api/colleges') {
    const result = getFilteredColleges(url.searchParams);
    return sendJson(res, 200, {
      count: result.length,
      colleges: result
    });
  }

  if (method === 'GET' && path === '/api/colleges/states') {
    const states = [...new Set(colleges.map(college => college.state))].sort();
    return sendJson(res, 200, { states });
  }

  if (method === 'POST' && path === '/api/saved-colleges') {
    const user = await getCurrentUser(req);
    if (!user) return sendError(res, 401, 'Login required.');
    const body = await readBody(req);
    const collegeName = String(body.collegeName || '').trim();
    if (!collegeName) return sendError(res, 400, 'collegeName is required.');
    const db = await readDb();
    db.savedColleges[user.id] = [...new Set([...(db.savedColleges[user.id] || []), collegeName])];
    await writeDb(db);
    return sendJson(res, 200, { savedColleges: db.savedColleges[user.id] });
  }

  if (method === 'GET' && path === '/api/saved-colleges') {
    const user = await getCurrentUser(req);
    if (!user) return sendError(res, 401, 'Login required.');
    const db = await readDb();
    return sendJson(res, 200, { savedColleges: db.savedColleges[user.id] || [] });
  }

  if (method === 'GET' && path === '/api/exams') {
    return sendJson(res, 200, { count: exams.length, exams });
  }

  if (method === 'GET' && path === '/api/scholarships') {
    const result = getFilteredScholarships(await readScholarships(), url.searchParams);
    const page = Math.max(1, Number(url.searchParams.get('page') || 1));
    const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit') || result.length || 1)));
    const start = (page - 1) * limit;
    return sendJson(res, 200, {
      count: result.length,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(result.length / limit)),
      scholarships: result.slice(start, start + limit)
    });
  }

  if (method === 'POST' && path === '/api/assessments') {
    const body = await readBody(req);
    const db = await readDb();
    const entry = {
      id: randomUUID(),
      userId: (await getCurrentUser(req))?.id || null,
      answers: body.answers || {},
      createdAt: new Date().toISOString()
    };
    db.assessmentAnswers.push(entry);
    await writeDb(db);
    return sendJson(res, 201, {
      assessment: entry,
      recommendation: {
        category: 'engineering',
        message: 'Based on this demo assessment, start by comparing Engineering, Commerce, and Arts paths.'
      }
    });
  }

  if (method === 'POST' && path === '/api/mentor/chat') {
    const body = await readBody(req);
    const userMessage = String(body.message || '').trim();
    const sessionId = getChatSessionId(body);

    if (!userMessage) {
      return sendError(res, 400, 'message is required');
    }

    const db = await readDb();
    const session = createChatSession(db, sessionId);
    session.messages.push({ role: 'user', text: userMessage, createdAt: new Date().toISOString() });
    session.profile = mergeChatProfile(session.profile, userMessage.toLowerCase());

    const lower = userMessage.toLowerCase();
    const intent = getIntent(lower);

    if (intent.wantsComparison) {
      const response = handleCareerComparison(lower);
      session.messages.push({ role: 'bot', text: response, createdAt: new Date().toISOString() });
      updateChatSession(db, session);
      await writeDb(db);
      return sendJson(res, 200, { reply: response, sessionId: session.id });
    }

    if (intent.wantsResumeTips) {
      const response = handleResumeTips(lower);
      session.messages.push({ role: 'bot', text: response, createdAt: new Date().toISOString() });
      updateChatSession(db, session);
      await writeDb(db);
      return sendJson(res, 200, { reply: response, sessionId: session.id });
    }

    if (intent.wantsSkillGap) {
      const response = handleSkillGap(lower);
      session.messages.push({ role: 'bot', text: response, createdAt: new Date().toISOString() });
      updateChatSession(db, session);
      await writeDb(db);
      return sendJson(res, 200, { reply: response, sessionId: session.id });
    }

    if (intent.wantsSalary) {
      const response = handleSalaryInsights(lower);
      session.messages.push({ role: 'bot', text: response, createdAt: new Date().toISOString() });
      updateChatSession(db, session);
      await writeDb(db);
      return sendJson(res, 200, { reply: response, sessionId: session.id });
    }

    if (intent.wantsPersonality) {
      const response = handlePersonalityGuidance(lower);
      session.messages.push({ role: 'bot', text: response, createdAt: new Date().toISOString() });
      updateChatSession(db, session);
      await writeDb(db);
      return sendJson(res, 200, { reply: response, sessionId: session.id });
    }

    const missingQuestions = buildMissingQuestions(session.profile);
    if (missingQuestions.length) {
      const response = `I need a little more detail to personalize your guidance. ${missingQuestions.join(' ')}`;
      session.messages.push({ role: 'bot', text: response, createdAt: new Date().toISOString() });
      updateChatSession(db, session);
      await writeDb(db);
      return sendJson(res, 200, {
        reply: response,
        sessionId: session.id,
        suggestedCategories: careerCategories.map(c => ({ id: c.id, name: c.name, icon: c.icon }))
      });
    }

    const guidance = buildGuidanceReply(session, userMessage, intent);
    session.messages.push({ role: 'bot', text: guidance.reply, createdAt: new Date().toISOString() });
    updateChatSession(db, session);
    await writeDb(db);

    return sendJson(res, 200, {
      reply: guidance.reply,
      sessionId: session.id,
      suggested: guidance.suggested
    });
  }

  return sendError(res, 404, 'API route not found.');
}


async function serveStatic(req, res, url) {
  const requestedPath = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
  const filePath = normalize(join(ROOT_DIR, requestedPath));
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  try {
    const content = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': contentTypes[extname(filePath)] || 'application/octet-stream' });
    res.end(content);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}

async function handler(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname.startsWith('/api/')) {
      return await handleApi(req, res, url);
    }
    return await serveStatic(req, res, url);
  } catch (error) {
    console.error(error);
    return sendError(res, 500, 'Internal server error.');
  }
}

export default handler;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = createServer(handler);
  server.listen(PORT, () => {
    console.log(`NextStep backend running at http://localhost:${PORT}`);
    console.log(`API health check: http://localhost:${PORT}/api/health`);
  });
}
