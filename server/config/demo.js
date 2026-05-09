// Key function for AI generation with timeout and fallback
exports.generateWebsite = async (req, res) => {
  const { prompt } = req.body;
  const userId = req.user.id;

  try {
    // Check user credits
    const user = await User.findById(userId);
    if (user.credits < 1) {
      return res.status(400).json({ message: "Insufficient credits" });
    }

    const startTime = Date.now();

    // Step 1: Try Ollama (Local LLM)
    let generatedCode;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "llama3",
          prompt: `Generate a complete modern responsive website for: ${prompt}. Use Tailwind CSS.`,
          stream: false
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);
      const data = await ollamaResponse.json();
      generatedCode = data.response;
      llmUsed = 'ollama';
    } catch (error) {
      // Step 2: Automatic Fallback to OpenRouter
      console.log("Ollama timeout/failure → Falling back to OpenRouter");
      const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-haiku",
          messages: [{ role: "user", content: `Create a complete responsive website code for: ${prompt}` }]
        })
      });
      const data = await openRouterResponse.json();
      generatedCode = data.choices[0].message.content;
      llmUsed = 'openrouter';
    }

    const responseTime = Date.now() - startTime;

    // Save project
    const newProject = new Website({
      userId,
      title: prompt.substring(0, 50),
      prompt,
      htmlCode: generatedCode,
      llmUsed,
      responseTime,
      status: 'generated'
    });

    await newProject.save();

    // Deduct credit
    user.credits -= 1;
    await user.save();

    res.status(200).json({
      success: true,
      project: newProject,
      message: `Website generated successfully using ${llmUsed}`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate website" });
  }
};