

const ollamaUrl = "http://localhost:11434/api/chat"
const ollamaModel = process.env.OLLAMA_MODEL || "llama3"

export const generateWithOllama = async (prompt) => {
    
    // 5 sec ka timer lagao
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    try {
        const res = await fetch(ollamaUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: ollamaModel,
                messages: [
                    { role: "system", content: "You must return ONLY valid raw JSON." },
                    { role: 'user', content: prompt }
                ],
                stream: false,
                temperature: 0.2
            }),
            signal: controller.signal
        })

        clearTimeout(timeout)

        if (!res.ok) {
            throw new Error("Ollama HTTP error: " + res.status)
        }

        const data = await res.json()
        return data.message.content

    } catch (err) {
        clearTimeout(timeout)
        // Error throw karenge taki dusri file me catch ho aur OpenRouter pe chala jaye
        throw err 
    }
}