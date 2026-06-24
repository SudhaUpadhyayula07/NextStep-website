// Career Guidance AI Module
// Provides comprehensive career counseling and guidance

export const careerComparisons = {
  'software engineer vs data scientist': {
    summary: 'Both rewarding IT paths with different focuses',
    paths: [
      {
        name: 'Software Engineer',
        education: 'Bachelor\'s in CS/IT (4 years)',
        exams: ['JEE Main', 'JEE Advanced', 'BITSAT'],
        skills: ['Programming (Java, Python, C++)', 'DSA', 'System Design', 'Web/Mobile Dev'],
        salary: '₹4-6L (starting) → ₹25L+ (senior)',
        jobMarket: 'Very High Demand',
        workLife: '8-10 hours/day, flexible WFH options',
        growth: 'Clear path to Tech Lead, Architect, CTO'
      },
      {
        name: 'Data Scientist',
        education: 'Bachelor\'s in CS + Masters or specialized course',
        exams: ['JEE Main', 'CAT (for MBA)', 'GATE'],
        skills: ['Python/R', 'Statistics', 'ML/AI', 'SQL', 'Visualization'],
        salary: '₹5-7L (starting) → ₹30L+ (senior)',
        jobMarket: 'High Demand',
        workLife: '9-11 hours/day, research-heavy',
        growth: 'ML Engineer, AI Lead, Research Scientist'
      }
    ]
  },
  'doctor vs engineer': {
    summary: 'Different timelines, responsibilities, and lifestyles',
    paths: [
      {
        name: 'Doctor (MBBS)',
        education: '5.5 years MBBS + specialization (3-5 years optional)',
        exams: ['NEET UG', 'NEET PG (for specialization)'],
        skills: ['Medical knowledge', 'Patient care', 'Diagnosis', 'Critical thinking'],
        salary: '₹3-5L (starting) → ₹50L+ (specialist)',
        jobMarket: 'Stable Demand',
        workLife: '10-12+ hours, on-call duties, high stress',
        growth: 'Specialist, Hospital Director, Medical Researcher'
      },
      {
        name: 'Engineer',
        education: '4 years B.Tech/B.E.',
        exams: ['JEE Main', 'JEE Advanced'],
        skills: ['Problem-solving', 'Design', 'Technical knowledge', 'Project management'],
        salary: '₹3-5L (starting) → ₹20-30L+ (senior)',
        jobMarket: 'Very High Demand',
        workLife: '8-10 hours, better work-life balance',
        growth: 'Senior Engineer, Tech Lead, Manager, Startup Founder'
      }
    ]
  }
};

export const resumeTips = {
  structure: [
    '✓ Keep it to 1 page (for freshers), max 2 pages for experienced',
    '✓ Use clear headings: Contact Info → Summary → Experience → Education → Skills → Projects',
    '✓ Use action verbs: Developed, Designed, Optimized, Led (not "Worked on")',
    '✓ Quantify achievements: "Improved performance by 40%" instead of "Made it faster"'
  ],
  formatting: [
    '✓ Use consistent fonts (Calibri, Arial) and sizes (10-12 pt body, larger for headers)',
    '✓ Maintain 1-inch margins on all sides',
    '✓ Use bullet points for readability',
    '✓ Save as PDF to preserve formatting'
  ],
  keywords: [
    'Industry-specific skills (e.g., Python, AWS, React for tech roles)',
    'Soft skills: Leadership, Communication, Problem-solving, Teamwork',
    'Certifications and achievements relevant to the role',
    'Avoid: Typos, unexplained gaps, irrelevant information'
  ],
  interviewPrep: [
    '1. Research the company: mission, recent news, culture, role requirements',
    '2. Prepare STAR method responses: Situation, Task, Action, Result',
    '3. Prepare 2-3 questions for the interviewer',
    '4. Practice: Tell me about yourself (max 2 min), Why this role, your strengths/weaknesses'
  ]
};

export const skillGapGuide = {
  'software engineer': {
    essential: ['Data Structures & Algorithms', 'System Design', 'Core Programming Language', 'Web/Mobile Development'],
    popular: ['Cloud (AWS/Azure)', 'DevOps', 'Microservices', 'Database Design'],
    learning: [
      'DSA: LeetCode, HackerRank (3-6 months)',
      'System Design: YouTube tutorials, books (6-12 months)',
      'Framework: Official docs + projects (2-3 months)',
      'Cloud: Coursera, Udemy (1-2 months)'
    ]
  },
  'data scientist': {
    essential: ['Python/R', 'Statistics', 'SQL', 'Machine Learning'],
    popular: ['Deep Learning', 'NLP', 'Computer Vision', 'Big Data (Spark)'],
    learning: [
      'Python: Codecademy, DataCamp (1-2 months)',
      'Statistics: Khan Academy (1-2 months)',
      'ML: Andrew Ng Coursera (3-4 months)',
      'Projects: Kaggle competitions (ongoing)'
    ]
  },
  'doctor': {
    essential: ['Anatomy', 'Physiology', 'Pharmacology', 'Pathology'],
    popular: ['Clinical Skills', 'Research', 'Specialization Knowledge'],
    learning: [
      'Pre-med: Physics, Chemistry, Biology (2 years)',
      'NEET prep: Coaching + self-study (1-2 years)',
      'MBBS: Structured curriculum (5.5 years)',
      'Internship & rotations: Hands-on experience'
    ]
  }
};

export const salaryInsights = {
  engineering: {
    startupVsProduct: 'Startups: ₹3-4L (high equity), Product companies: ₹5-8L (more stable)',
    progression: 'Junior (0-2y): ₹3-5L → Senior (3-5y): ₹10-15L → Lead (5+y): ₹20-35L',
    bySpecialization: {
      'Software': '₹4-6L starting',
      'Data Science': '₹5-7L starting',
      'AI/ML': '₹6-8L starting',
      'Cloud/DevOps': '₹4.5-6.5L starting'
    },
    marketTrend: '📈 High demand, salaries growing 15-20% YoY'
  },
  medical: {
    governmentVsPrivate: 'Government: ₹2-3L (job security), Private: ₹5-10L (better pay)',
    progression: 'Resident: ₹2-4L → Consultant: ₹15-50L → Specialist: ₹50L+',
    specializations: {
      'Cardiology': 'High demand, ₹30-60L',
      'Dermatology': 'Good WLB, ₹20-40L',
      'Surgery': 'High skill + demand, ₹30-50L',
      'General Practice': 'Lower barriers, ₹5-15L'
    },
    marketTrend: '📈 Growing demand for healthcare, especially in metro areas'
  }
};

export const personalityGuidance = {
  analytical: ['Data Scientist', 'Software Engineer', 'Researcher', 'Financial Analyst'],
  creative: ['Designer', 'Content Creator', 'Architect', 'Game Developer'],
  peopleOriented: ['Doctor', 'Counselor', 'Manager', 'Teacher', 'HR'],
  leadershipMinded: ['Entrepreneur', 'CEO', 'Project Manager', 'CTO', 'Dean'],
  hands_on: ['Mechanical Engineer', 'Surgeon', 'Electrician', 'Mechanic', 'Architect']
};

export function handleCareerComparison(lower) {
  const availableComparisons = Object.keys(careerComparisons);
  let response = 'I can compare these career paths:\n\n';
  
  let found = false;
  for (const [comparison, data] of Object.entries(careerComparisons)) {
    if (lower.includes(comparison.replace(/ vs /gi, '')) || lower.includes(comparison)) {
      found = true;
      response = `**${data.summary}**\n\n`;
      for (const path of data.paths) {
        response += `**${path.name}**\n`;
        response += `• Education: ${path.education}\n`;
        response += `• Key Skills: ${path.skills.join(', ')}\n`;
        response += `• Starting Salary: ${path.salary}\n`;
        response += `• Job Market: ${path.jobMarket}\n`;
        response += `• Work-Life Balance: ${path.workLife}\n`;
        response += `• Career Growth: ${path.growth}\n\n`;
      }
      break;
    }
  }
  
  if (!found) {
    response += availableComparisons.map(c => `• ${c}`).join('\n');
    response += '\n\nWhich two would you like me to compare?';
  }
  
  return response;
}

export function handleResumeTips(lower) {
  let response = '**Resume & Interview Preparation Guide**\n\n';
  response += '**📝 Resume Structure:**\n' + resumeTips.structure.join('\n') + '\n\n';
  response += '**🎨 Formatting Tips:**\n' + resumeTips.formatting.join('\n') + '\n\n';
  response += '**🔑 Keywords to Include:**\n' + resumeTips.keywords.join('\n') + '\n\n';
  response += '**🎤 Interview Preparation:**\n' + resumeTips.interviewPrep.join('\n') + '\n\n';
  response += 'Need specific advice on cover letters or interview questions for a particular role?';
  
  return response;
}

export function handleSkillGap(lower) {
  let response = 'What role are you targeting? I can provide a personalized skill development roadmap.\n\n';
  response += 'Available roles:\n• Software Engineer\n• Data Scientist\n• Doctor\n\nOr mention a specific role!';
  
  // If a role is mentioned, provide detailed roadmap
  for (const [role, guide] of Object.entries(skillGapGuide)) {
    if (lower.includes(role)) {
      response = `**Skill Development Plan for ${role.toUpperCase()}**\n\n`;
      response += `**Essential Skills (must-have):**\n${guide.essential.map(s => `✓ ${s}`).join('\n')}\n\n`;
      response += `**Popular Specializations:**\n${guide.popular.map(s => `→ ${s}`).join('\n')}\n\n`;
      response += `**Learning Timeline & Resources:**\n${guide.learning.join('\n')}\n\n`;
      response += 'Would you like recommendations for specific courses or certifications?';
      break;
    }
  }
  
  return response;
}

export function handleSalaryInsights(lower) {
  let response = 'Let me share salary insights for careers you might be interested in.\n\n';
  
  if (lower.includes('engineer') || lower.includes('software')) {
    response = '**Engineering Salaries in India (2025)**\n\n';
    response += `**Startup vs Product Companies:** ${salaryInsights.engineering.startupVsProduct}\n\n`;
    response += `**Career Progression:** ${salaryInsights.engineering.progression}\n\n`;
    response += `**By Specialization:**\n`;
    for (const [spec, salary] of Object.entries(salaryInsights.engineering.bySpecialization)) {
      response += `• ${spec}: ${salary}\n`;
    }
    response += `\n**Market Trend:** ${salaryInsights.engineering.marketTrend}`;
  } else if (lower.includes('doctor') || lower.includes('medical')) {
    response = '**Medical Profession Salaries in India (2025)**\n\n';
    response += `**Government vs Private:** ${salaryInsights.medical.governmentVsPrivate}\n\n`;
    response += `**Career Progression:** ${salaryInsights.medical.progression}\n\n`;
    response += `**By Specialization:**\n`;
    for (const [spec, info] of Object.entries(salaryInsights.medical.specializations)) {
      response += `• ${spec}: ${info}\n`;
    }
    response += `\n**Market Trend:** ${salaryInsights.medical.marketTrend}`;
  }
  
  return response;
}

export function handlePersonalityGuidance(lower) {
  let response = 'Based on personality types, here are suitable career matches:\n\n';
  response += '**Tell me your personality type:**\n';
  response += '🔬 Analytical (Problem-solving, data-driven)\n';
  response += '🎨 Creative (Artistic, innovative)\n';
  response += '👥 People-Oriented (Helping, empathetic)\n';
  response += '🎯 Leadership-Minded (Strategic, ambitious)\n';
  response += '✋ Hands-On (Practical, building things)\n\n';
  
  for (const [type, careers] of Object.entries(personalityGuidance)) {
    if (lower.includes(type.replace(/_/g, ' ')) || lower.includes(type)) {
      response = `**Careers for ${type.replace(/_/g, ' ').toUpperCase()} personalities:**\n\n`;
      careers.forEach(career => {
        response += `✓ ${career}\n`;
      });
      response += '\nWhich of these interests you most?';
      break;
    }
  }
  
  return response;
}
