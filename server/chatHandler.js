import { GoogleGenerativeAI } from '@google/generative-ai';

const MAX_USER_TEXT_LENGTH = 2000;
const MODEL_NAME = 'gemini-2.0-flash';

export class ChatValidationError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = 'ChatValidationError';
    this.statusCode = statusCode;
  }
}

function buildPrompt(bodyPart, userText) {
  return `You are 'Somatic', an educational health companion. The user clicked their ${bodyPart} and said: "${userText}". Provide a short, educational summary of what might cause this discomfort, and 2 general wellness tips. You MUST output strictly as a JSON object with keys: 'educational_summary', 'wellness_tips' (array), and 'disclaimer'. You are NOT a doctor. Ensure the disclaimer explicitly states you are an AI and they must see a medical professional.`;
}

function parseGeminiResponse(text) {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No JSON found');
  } catch {
    return {
      educational_summary: text,
      wellness_tips: [],
      disclaimer:
        'I am an AI and not a medical professional. Please consult a doctor.',
    };
  }
}

export function validateChatInput({ bodyPart, userText }) {
  if (!userText || typeof userText !== 'string' || !userText.trim()) {
    throw new ChatValidationError('userText is required');
  }

  if (userText.length > MAX_USER_TEXT_LENGTH) {
    throw new ChatValidationError(
      `userText must be ${MAX_USER_TEXT_LENGTH} characters or fewer`
    );
  }

  const normalizedBodyPart =
    typeof bodyPart === 'string' && bodyPart.trim()
      ? bodyPart.trim()
      : 'unspecified area';

  return {
    bodyPart: normalizedBodyPart,
    userText: userText.trim(),
  };
}

export async function handleChatRequest({ bodyPart, userText }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const validated = validateChatInput({ bodyPart, userText });
  const prompt = buildPrompt(validated.bodyPart, validated.userText);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const result = await model.generateContent(prompt);
  const text = result.response.text();

  return parseGeminiResponse(text);
}
