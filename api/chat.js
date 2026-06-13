import {
  handleChatRequest,
  ChatValidationError,
} from '../server/chatHandler.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await handleChatRequest(req.body ?? {});
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof ChatValidationError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    console.error('Gemini API error:', error);
    return res.status(502).json({
      error: 'Failed to generate a response. Please try again shortly.',
    });
  }
}
