const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const classifyTicket = async (title, description) => {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
    });

    const prompt = `You are a support ticket classifier. Given the ticket below, return ONLY a valid JSON object with no extra text, no markdown, no explanation, no code fences.

Ticket title: ${title}
Ticket description: ${description}

Return exactly this JSON structure:
{
  "category": "one of: billing, technical, general, complaint, other",
  "priority": "one of: low, medium, high, urgent",
  "aiSuggestedReply": "a helpful 2-3 sentence reply to this customer"
}`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    // Strip any accidental markdown fences
    const clean = rawText.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
};

module.exports = { classifyTicket };