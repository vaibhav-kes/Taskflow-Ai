const Groq = require('groq-sdk');
const ApiError = require('../utils/ApiError');

// Initialize Groq client lazily
let groqClient = null;

const getGroqClient = () => {
  if (!groqClient) {
    if (!process.env.GROQ_API_KEY) {
      throw new ApiError('Groq API key is not configured', 500);
    }
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groqClient;
};

/**
 * Generate an AI summary for a list of tasks
 * @param {Array} tasks - Array of task objects
 * @returns {Promise<string>} AI-generated summary
 */
const generateTaskSummary = async (tasks) => {
  const groq = getGroqClient();

  const taskList = tasks.map((t, i) => {
    return `${i + 1}. "${t.title}" — Status: ${t.status}, Priority: ${t.priority}, Assigned to: ${t.assignedTo?.name || 'Unassigned'}${t.dueDate ? `, Due: ${new Date(t.dueDate).toLocaleDateString()}` : ''}`;
  }).join('\n');

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are a project management assistant. Provide concise, actionable summaries of task lists. Focus on overall progress, blockers, priorities, and key recommendations. Keep the summary under 300 words.',
      },
      {
        role: 'user',
        content: `Summarize the following ${tasks.length} tasks and provide insights:\n\n${taskList}`,
      },
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.5,
    max_tokens: 500,
  });

  return completion.choices[0]?.message?.content || 'Unable to generate summary.';
};

/**
 * Generate AI insights for a project
 * @param {object} project - Project object
 * @param {Array} tasks - Array of task objects for the project
 * @returns {Promise<string>} AI-generated project insights
 */
const generateProjectInsights = async (project, tasks) => {
  const groq = getGroqClient();

  const completed = tasks.filter((t) => t.status === 'completed').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const todo = tasks.filter((t) => t.status === 'todo').length;
  const overdue = tasks.filter((t) => t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < new Date()).length;

  const context = `
Project: "${project.title}"
Status: ${project.status}
Team Size: ${project.teamMembers?.length || 0} members
Deadline: ${project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}

Task Breakdown:
- Total: ${tasks.length}
- Completed: ${completed}
- In Progress: ${inProgress}
- To Do: ${todo}
- Overdue: ${overdue}
- Completion Rate: ${tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0}%
`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are a project management analyst. Provide brief, actionable insights about project health, risks, and recommendations. Keep it under 200 words.',
      },
      {
        role: 'user',
        content: `Analyze this project and give insights:\n${context}`,
      },
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.5,
    max_tokens: 400,
  });

  return completion.choices[0]?.message?.content || 'Unable to generate insights.';
};

module.exports = { generateTaskSummary, generateProjectInsights };
