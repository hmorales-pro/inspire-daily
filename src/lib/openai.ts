const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key');
}

export const optimizeResponse = async (response: string): Promise<string> => {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en communication sur les réseaux sociaux. Tu dois optimiser le message fourni pour le rendre plus engageant, tout en gardant son essence. Ajoute des hashtags pertinents à la fin.'
        },
        {
          role: 'user',
          content: response
        }
      ],
    }),
  });

  const data = await res.json();
  return data.choices[0].message.content;
};