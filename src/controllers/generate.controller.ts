import { Request, Response } from "express";
import { generateBlog } from "../services/ai.service";

const ALLOWED_TONES = [
  "Professional",
  "Casual",
  "Formal",
  "Creative",
  "Humorous",
  "Inspirational",
  "Technical",
  "Storytelling",
  "Cinematic",
  "Academic",
];

export async function generate(req: Request, res: Response): Promise<void> {
  try {
    console.log(" REQUEST BODY:", req.body);

    const { topic, tone, length, language, cinematicMode } = req.body;

    if (!topic || topic.length < 5) {
      res.status(400).json({ error: "Topic too short" });
      return;
    }

    if (!ALLOWED_TONES.includes(tone)) {
      res.status(400).json({ error: "Invalid tone" });
      return;
    }

    const result = await generateBlog({
      topic,
      tone,
      length,
       language,
      cinematicMode,
    });

    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
