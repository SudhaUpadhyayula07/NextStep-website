export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { score, answers } = req.body;
    return res.status(200).json({ 
      success: true, 
      message: 'Assessment saved',
      assessment: { score, answers, id: Math.random().toString(36).substr(2, 9) }
    });
  } else if (req.method === 'GET') {
    return res.status(200).json({ 
      assessments: [],
      message: 'No assessments yet'
    });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}
