export default async function handler(req, res) {
  return res.status(200).json({
    status: 'ok',
    gemini_api_key_set: !!process.env.GEMINI_API_KEY,
    gemini_api_key_preview: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 10) + '...' : 'NOT SET'
  });
}
