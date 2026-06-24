export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  // Simple signup stub — in production, save to database
  return res.status(201).json({
    success: true,
    message: 'User created successfully',
    token: `token_${Math.random().toString(36).substr(2, 9)}`,
    user: { email, name, id: Math.random().toString(36).substr(2, 9) }
  });
}
