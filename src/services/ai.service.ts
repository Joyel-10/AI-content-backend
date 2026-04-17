import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateBlog({
  topic,
  tone,
  length,
  language,
  cinematicMode,
}: any) {
  try {
    console.log(" INPUT TO AI:", { topic, tone, length, language, cinematicMode });
    console.log(" API KEY:", process.env.GROQ_API_KEY ? "Loaded " : "Missing ");

    const lengthMap: any = {
      short: "100 words",
      medium: "300 words",
      long: "700 words",
    };

    const safeTone = tone || "Professional";
    const safeLength = lengthMap[length] || "300 words";
    const targetLanguage = language || "English";

    const prompt = `
Write a well-structured ${safeTone} blog.

TOPIC:
"${topic}"

IMPORTANT LANGUAGE RULE:
- The topic is provided in English
- You MUST convert/translate the topic into ${targetLanguage}
- The entire output MUST be ONLY in ${targetLanguage}
- Do NOT use English
- Do NOT mix languages

Requirements:
- Length: ${safeLength}
- Include introduction, headings, and conclusion
- Use natural, fluent ${targetLanguage}

${
  cinematicMode
    ? `
Cinematic Mode:
- Add emotional storytelling
- Use vivid descriptions
- Make it feel like a narrative experience
`
    : ""
}

FINAL RULE:
Return content ONLY in ${targetLanguage}.
`;

    const res = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You must strictly follow the selected language. Always translate the topic and generate output only in that language (${targetLanguage}).`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
    });

    console.log("GROQ RESPONSE RECEIVED ");

    const content = res.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content generated from AI");
    }

    return { content };
  } catch (error: any) {
    console.error("SERVICE ERROR:", error.message || error);
    throw new Error(error.message || "AI generation failed");
  }
}

export async function saveToHistory(data: any) {
  console.log("Saving to history...", data.topic);
  return { success: true };
}