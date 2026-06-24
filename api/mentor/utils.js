export function getFallbackReply(message = '') {
  const lower = String(message).toLowerCase();

  if (/(career|path|stream|future|profession|interest|goal)/.test(lower)) {
    return 'I’m your AI Mentor. Tell me your current stream, interests, or goals and I’ll help you compare careers, exams, scholarships, and colleges.';
  }

  if (/(exam|entrance|jee|neet|gate|cat|exam preparation|exam prep|test|board exam)/.test(lower)) {
    return 'For exam planning, focus on understanding concepts, solving past papers, and building a weekly study plan. Share which exam you are preparing for and your current stage so I can suggest the next step.';
  }

  if (/(scholarship|fund|financial|fees|aid|grant|support)/.test(lower)) {
    return 'For scholarships, I can help identify eligibility and application tips. Tell me what type of scholarship you need, your stream, and your academic background.';
  }

  if (/(college|university|admission|campus|iit|nit|college application)/.test(lower)) {
    return 'I can guide you through college and university choices, admissions, and entry requirements. Tell me which branch or school you are interested in and your current education level.';
  }

  return 'I’m here to help with career guidance, exam planning, scholarship research, and college decisions. Please tell me about your current stream or goals so I can share a useful next step.';
}
