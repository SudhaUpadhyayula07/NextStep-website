export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  // Simple auth stub — in production, verify against a database
  return res.status(200).json({
    success: true,
    token: `token_${Math.random().toString(36).substr(2, 9)}`,
    user: { email, id: Math.random().toString(36).substr(2, 9) }
  });
}
