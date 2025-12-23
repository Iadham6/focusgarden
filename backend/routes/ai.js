const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const OpenAI = require("openai");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } }); // 8MB

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper: extract text from uploaded file (PDF or TXT)
async function extractText(file) {
  const mime = file.mimetype || "";
  const name = (file.originalname || "").toLowerCase();

  // PDF
  if (mime.includes("pdf") || name.endsWith(".pdf")) {
    const data = await pdfParse(file.buffer);
    return data.text || "";
  }

  // TXT
  if (mime.includes("text") || name.endsWith(".txt")) {
    return file.buffer.toString("utf-8");
  }

  throw new Error("Unsupported file type. Upload PDF or TXT.");
}

// POST /api/ai/summarize (multipart/form-data: file)
router.post("/summarize", upload.single("file"), async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY on server" });
    }
    if (!req.file) return res.status(400).json({ error: "file is required" });

    const text = await extractText(req.file);

    const trimmed = text.trim();
    if (!trimmed) return res.status(400).json({ error: "Could not extract text from file" });

    // Keep it simple: cap very long text to avoid huge requests
    const MAX_CHARS = 45000;
    const inputText = trimmed.length > MAX_CHARS ? trimmed.slice(0, MAX_CHARS) : trimmed;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You are a helpful study assistant. Summarize the lecture clearly for a sophomore CS student.",
        },
        {
          role: "user",
          content:
            `Summarize this lecture in:\n` +
            `1) 8 bullet key points\n` +
            `2) 5 important definitions\n` +
            `3) 5 quiz questions with answers\n\n` +
            `Lecture text:\n` +
            inputText,
        },
      ],
    });

    // Responses API returns output items; easiest is to read the text output
    const summaryText =
      response.output_text || "No summary text returned.";

    res.json({ summary: summaryText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "AI summarization failed" });
  }
});

module.exports = router;
