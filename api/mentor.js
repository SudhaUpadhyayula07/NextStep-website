import { getFallbackReply } from './mentor/utils.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Request must include a message.' });
  }

  let reply;
  if (process.env.GEMINI_API_KEY) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] })
        }
      );

      if (response.ok) {
        const data = await response.json();
        reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      } else {
        const errorText = await response.text();
        console.error('Gemini request failed:', response.status, errorText);
      }
    } catch (err) {
      console.error('Mentor handler error:', err);
    }
  } else {
    console.warn('GEMINI_API_KEY is not set; returning fallback mentor guidance.');
  }

  if (!reply) {
    reply = getFallbackReply(message);
  }

  res.status(200).json({ reply });
}
