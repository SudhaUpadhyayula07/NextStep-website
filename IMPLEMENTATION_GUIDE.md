# AI Mentor Implementation Guide - Career Guidance Module

## Architecture Overview

The career guidance system is built with a modular architecture:

```
9-cgai.html (UI)
    ↓
fetch('/api/mentor/chat') 
    ↓
server.js (/api/mentor/chat endpoint)
    ↓
Intent Detection
    ↓
├─ wantsComparison → careerGuidance.handleCareerComparison()
├─ wantsResumeTips → careerGuidance.handleResumeTips()
├─ wantsSkillGap → careerGuidance.handleSkillGap()
├─ wantsSalary → careerGuidance.handleSalaryInsights()
├─ wantsPersonality → careerGuidance.handlePersonalityGuidance()
└─ (default) → Career Path Recommendation (original logic)
```

## Adding New Guidance Types

### Step 1: Update Intent Detection (server.js)

```javascript
const intent = {
  wantsExams: /(exam|...)/i.test(lower),
  wantsNewGuidance: /(keyword1|keyword2|keyword3)/i.test(lower),  // Add new line
  // ... other intents
};
```

### Step 2: Add Handler Function (careerGuidance.js)

```javascript
export function handleNewGuidance(lower) {
  let response = 'Your guidance content here\n\n';
  // Add logic to check specific keywords and customize response
  return response;
}
```

### Step 3: Add Intent Check (server.js)

```javascript
if (intent.wantsNewGuidance) {
  const response = handleNewGuidance(lower);
  return sendJson(res, 200, { reply: response });
}
```

### Step 4: Update UI Buttons (9-cgai.html)

```html
<button type="button" class="suggestion-button ...">New Guidance Topic</button>
```

## Data Structure Examples

### Career Comparison Format

```javascript
'career1 vs career2': {
  summary: 'Brief comparison summary',
  paths: [
    {
      name: 'Career Name',
      education: 'Duration and degree',
      exams: ['Exam 1', 'Exam 2'],
      skills: ['Skill 1', 'Skill 2'],
      salary: 'Range with progression',
      jobMarket: 'Demand level',
      workLife: 'Hours and lifestyle',
      growth: 'Career progression paths'
    }
  ]
}
```

### Skill Gap Guide Format

```javascript
'role-name': {
  essential: ['Skill 1', 'Skill 2'],
  popular: ['Optional specialization 1'],
  learning: [
    'Topic: Platform/Resource (Duration)',
    'Topic: Platform/Resource (Duration)'
  ]
}
```

### Salary Data Format

```javascript
{
  metric: 'Range or description',
  progression: 'Junior → Senior progression',
  specializations: {
    'Specialization': 'Salary range'
  },
  marketTrend: '📈 Trend description'
}
```

## Adding New Comparisons

To add "Lawyer vs Accountant" comparison:

1. In `careerGuidance.js`, add to `careerComparisons`:

```javascript
'lawyer vs accountant': {
  summary: 'Legal and finance professionals with different roles',
  paths: [
    {
      name: 'Lawyer',
      education: '3-year law degree (BA LLB or 5-year LLB)',
      exams: ['CLAT', 'AILET', 'State Bar Exams'],
      skills: ['Legal knowledge', 'Argumentation', 'Research', 'Client management'],
      salary: '₹3-5L (starting) → ₹50L+ (partner)',
      jobMarket: 'Stable Demand',
      workLife: '10-12+ hours, high stress during cases',
      growth: 'Senior Advocate, Judge, Legal Consultant'
    },
    {
      name: 'Accountant',
      education: 'BCom + CA/CMA certification (5-8 years total)',
      exams: ['CA Foundation', 'CA Intermediate', 'CA Final'],
      skills: ['Accounting', 'Tax knowledge', 'Auditing', 'Financial analysis'],
      salary: '₹2-4L (starting) → ₹30L+ (CA partner)',
      jobMarket: 'Very High Demand',
      workLife: '9-11 hours, seasonal busy periods',
      growth: 'Partner, Consultant, CFO'
    }
  ]
}
```

## Adding New Salary Insights

To add healthcare salaries:

```javascript
export const salaryInsights = {
  healthcare: {
    governmentVsPrivate: 'Government: ₹2-3L (job security), Private: ₹5-15L (better pay)',
    progression: 'Entry: ₹2-3L → Mid-level: ₹5-10L → Senior: ₹15-50L',
    specializations: {
      'Nursing': '₹2-3.5L starting',
      'Physiotherapy': '₹2-4L starting',
      'Pharmacy': '₹2-3.5L starting',
      'Medical Lab Tech': '₹1.5-2.5L starting'
    },
    marketTrend: '📈 Growing demand for healthcare workers post-COVID'
  },
  // ... other fields
};
```

Then add handler:

```javascript
if (lower.includes('healthcare') || lower.includes('nursing')) {
  response = '**Healthcare Salaries in India (2025)**\n\n';
  response += `**Government vs Private:** ${salaryInsights.healthcare.governmentVsPrivate}\n\n`;
  // ... rest of response
}
```

## Testing New Features

### Unit Test Template

```javascript
// Test intent detection
const testMessage = "Your test message here";
const lower = testMessage.toLowerCase();
const wantsNewFeature = /(keyword1|keyword2)/i.test(lower);
console.assert(wantsNewFeature === true, "Intent detection failed");

// Test handler
const response = handleNewGuidance(lower);
console.assert(response.includes("expected content"), "Handler output incorrect");
```

### Integration Test Steps

1. Start the backend: `npm run dev`
2. Open browser DevTools Console
3. Simulate request:
```javascript
fetch('/api/mentor/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Your test query' })
}).then(r => r.json()).then(data => console.log(data))
```

## Performance Considerations

- **Keyword Matching**: Currently uses simple regex. Consider NLP for complex queries
- **Response Size**: Keep responses under 1MB for quick loading
- **Caching**: Consider caching common queries
- **Error Handling**: Always return a fallback response

## Best Practices

1. **Keep Functions Pure**: Handler functions should not modify global state
2. **Consistent Formatting**: Use consistent markdown in responses
3. **Keyword Coverage**: Include synonyms and variations in regex patterns
4. **Data Accuracy**: Verify salary and market data annually
5. **User Feedback**: Track which guidance types are used most
6. **Multilingual**: Consider adding support for regional languages

## Debugging Tips

1. **Enable Detailed Logging**:
```javascript
console.log('Intent detected:', intent);
console.log('Handler response:', response);
```

2. **Check Network Requests**: Use browser DevTools Network tab
3. **Verify Regex Patterns**: Test regex with regex101.com
4. **Check Data Structure**: Ensure all fields are properly formatted

## Future Extensibility

The system is designed to easily add:
- Machine learning-based intent classification
- Integration with external APIs (salary databases, job markets)
- Multi-language support
- User preference tracking
- Personalized recommendations based on user history
- Real-time job market data feeds
