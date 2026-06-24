export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not set in environment variables.' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Request must include a message.' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(502).json({ error: 'Gemini request failed', details: errorText });
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't get a response.";
    res.status(200).json({ reply });
  } catch (err) {
    console.error('Mentor handler error:', err);
    res.status(500).json({ error: 'Mentor API error', details: err.message || String(err) });
  }
}
