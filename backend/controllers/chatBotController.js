import axios from "axios";

export const chatBot = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ reply: "Invalid messages format" });
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
You are a medical symptom checker.

Rules:
- Answer in MAX 2 lines
- Give possible conditions only
- Ask 1 follow-up question
- No long explanations
`,
          },
          ...messages,
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply =
      response.data?.choices?.[0]?.message?.content ||
      "No response from AI";

    res.json({ reply });

  } catch (error) {
    console.error("ChatBot Error:", error.response?.data || error.message);
    res.status(500).json({ reply: "Server error" });
  }
};